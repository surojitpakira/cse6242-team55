r"""
Build lendingClubCleanData_v3.csv from the raw Lending Club accepted-loans file.

Run from the repo folder:
    python app\API\prep_data.py
or pass paths:
    python app\API\prep_data.py <raw_file> <output_csv>

Output goes next to this script (app/API) because creditproject_v3.py reads
"lendingClubCleanData_v3.csv" from the folder it is run in.
"""
import sys
from pathlib import Path

import pandas as pd

RAW = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(
    r"C:\Surojit\loan-data\accepted_2007_to_2018Q4.csv.gz")
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).with_name(
    "lendingClubCleanData_v3.csv")

FIRST_YEAR, LAST_YEAR = 2007, 2011

RAW_COLS = [
    "loan_amnt", "term", "emp_length", "home_ownership", "annual_inc",
    "zip_code", "dti", "delinq_2yrs", "inq_last_6mths", "mths_since_last_delinq",
    "open_acc", "total_acc", "revol_bal", "earliest_cr_line", "int_rate",
    "loan_status", "issue_d",
    # creditproject_v3.py drops these three right after loading, so keep them
    "grade", "sub_grade", "addr_state",
]

# Order matters: the training script drops the first column (the index) and
# the app/model code expects these feature names.
FEATURES = [
    "loan_amnt", "term", "emp_length", "home_ownership", "annual_inc",
    "zip_code", "dti", "delinq_2yrs", "inq_last_6mths", "mths_since_last_delinq",
    "open_acc", "total_acc", "revol_bal", "cred_hist_mth", "revol_bal_to_annual_inc",
]
KEEP = FEATURES + ["int_rate", "loan_status", "grade", "sub_grade", "addr_state"]

# Home ownership values the web form sends (note the form spells it "mortage")
HOME_MAP = {"RENT": "RENT", "OWN": "OWN", "MORTGAGE": "mortage"}


def emp_length_to_years(s: pd.Series) -> pd.Series:
    """'< 1 year' -> 0, '10+ years' -> 10, '3 years' -> 3, 'n/a' -> NaN."""
    years = s.str.extract(r"(\d+)")[0].astype(float)
    years[s.str.startswith("<", na=False)] = 0.0
    return years


def main() -> None:
    print(f"Reading {RAW} ...")
    df = pd.read_csv(RAW, usecols=RAW_COLS, low_memory=False)
    print("raw rows:", len(df))

    # 1. keep loans issued 2007-2011 (matches the size/era of the original data)
    issue = pd.to_datetime(df["issue_d"], format="%b-%Y")
    df = df[issue.dt.year.between(FIRST_YEAR, LAST_YEAR)].copy()
    issue = issue[df.index]
    print(f"issued {FIRST_YEAR}-{LAST_YEAR}:", len(df))

    # 2. keep finished loans only and build the label: 0 = Fully Paid, 1 = Charged Off
    status = {"Fully Paid": 0, "Charged Off": 1}
    keep = df["loan_status"].isin(status)
    df, issue = df[keep].copy(), issue[keep]
    df["loan_status"] = df["loan_status"].map(status)
    print("finished loans:", len(df))

    # 3. clean each feature
    df["term"] = df["term"].str.extract(r"(\d+)")[0].astype(int)
    df["emp_length"] = emp_length_to_years(df["emp_length"])
    df["home_ownership"] = df["home_ownership"].str.upper().map(HOME_MAP).fillna("others")
    df["zip_code"] = df["zip_code"].str[:3]
    df["int_rate"] = pd.to_numeric(
        df["int_rate"].astype(str).str.rstrip("%").str.strip(), errors="coerce")

    earliest = pd.to_datetime(df["earliest_cr_line"], format="%b-%Y")
    df["cred_hist_mth"] = ((issue.dt.year - earliest.dt.year) * 12
                           + (issue.dt.month - earliest.dt.month)).astype(float)

    # blank means "never delinquent"; the web form's default is 0 as well
    df["mths_since_last_delinq"] = df["mths_since_last_delinq"].fillna(0.0)

    df = df[df["annual_inc"] > 0].copy()
    df["revol_bal_to_annual_inc"] = (df["revol_bal"] / df["annual_inc"]).round(4)

    # 4. drop rows still missing a needed value (a small share of rows)
    before = len(df)
    df = df.dropna(subset=FEATURES + ["int_rate"])
    print(f"dropped {before - len(df)} rows with missing values")

    # 5. save (index column included on purpose: creditproject_v3.py does iloc[:, 1:])
    df = df[KEEP].reset_index(drop=True)
    df.to_csv(OUT)

    print("\nsaved:", OUT)
    print("shape:", df.shape)
    print("\nloan_status share (0 = Fully Paid, 1 = Charged Off):")
    print(df["loan_status"].value_counts(normalize=True).round(3))
    print("\nsummary of numeric columns:")
    print(df[FEATURES + ["int_rate"]].describe().T[["min", "50%", "max"]])
    print("\nhome_ownership:", df["home_ownership"].value_counts().to_dict())
    print("sample rows:")
    print(df[FEATURES + ["int_rate", "loan_status"]].head(3).to_string())


if __name__ == "__main__":
    main()