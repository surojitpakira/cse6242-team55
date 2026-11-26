r"""
Compare a few approval (repaid vs charged off) classifiers on the same split.
Run from the app\API folder:
    python compare_approval_models.py
Reads lendingClubCleanData_v3.csv. Does NOT touch the saved models or the app.
"""
import sys
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder

CSV = sys.argv[1] if len(sys.argv) > 1 else "lendingClubCleanData_v3.csv"

data = pd.read_csv(CSV, header=0, dtype={"zip_code": str})
data = data.iloc[:, 1:]                                   # drop saved index column
data = data.drop(columns=["sub_grade", "grade", "addr_state"])

NUMERIC = ["loan_amnt", "term", "emp_length", "annual_inc", "dti", "delinq_2yrs",
           "inq_last_6mths", "mths_since_last_delinq", "open_acc", "total_acc",
           "revol_bal", "cred_hist_mth", "revol_bal_to_annual_inc"]
NOMINAL = ["home_ownership", "zip_code"]


def preprocessor(nominal):
    num = Pipeline([("imp", SimpleImputer(strategy="median")), ("sc", MinMaxScaler())])
    cat = Pipeline([("imp", SimpleImputer(strategy="constant", fill_value="missing")),
                    ("oh", OneHotEncoder(handle_unknown="ignore"))])
    parts = [("num", num, NUMERIC)]
    if nominal:
        parts.append(("cat", cat, nominal))
    return ColumnTransformer(parts)


X = data.drop(columns=["loan_status", "int_rate"])
y = data["loan_status"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

models = {
    "KNN k=1 (original)": Pipeline([("p", preprocessor(NOMINAL)),
                                    ("m", KNeighborsClassifier(n_neighbors=1))]),
    "KNN k=100": Pipeline([("p", preprocessor(NOMINAL)),
                           ("m", KNeighborsClassifier(n_neighbors=100))]),
    "Logistic regression": Pipeline([("p", preprocessor(NOMINAL)),
                                     ("m", LogisticRegression(max_iter=1000, class_weight="balanced"))]),
    "Logistic regression, no zip": Pipeline([("p", preprocessor(["home_ownership"])),
                                             ("m", LogisticRegression(max_iter=1000, class_weight="balanced"))]),
    "Gradient boosting": Pipeline([("p", preprocessor(["home_ownership"])),
                                   ("m", HistGradientBoostingClassifier(class_weight="balanced", random_state=42))]),
}

print(f"Test rows: {len(y_test)}   charged-off share: {y_test.mean():.3f}")
print(f"Baseline accuracy (always 'repaid'): {1 - y_test.mean():.3f}\n")
print(f"{'model':30s} {'AUC':>6s} {'accuracy':>9s} {'recall':>7s}")
for name, model in models.items():
    model.fit(X_train, y_train)
    prob = model.predict_proba(X_test)[:, 1]
    pred = model.predict(X_test)
    print(f"{name:30s} {roc_auc_score(y_test, prob):6.3f} "
          f"{accuracy_score(y_test, pred):9.3f} {recall_score(y_test, pred):7.3f}")