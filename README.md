# P2P Loan Application Predictor (CSE 6242, Team 55)

Team project for Georgia Tech CSE 6242 (Data and Visual Analytics), built by a team of 3 to 4 students. It is a small web app. A user enters basic loan application details and sees a predicted outcome, an estimated interest rate, a credit score and two alternative loan offers (36 and 60 month terms). Interactive D3 charts show how applicants compare on debt-to-income ratio, employment length and region.

In late 2026 I came back to this repository, rebuilt the data preparation, retrained the models with a current version of scikit-learn and got the app running again. The "What I changed" section below lists what was done.

## What it does

1. The user fills in a form: loan amount, term, employment length, home ownership, annual income, ZIP code, total debt, delinquencies, recent credit inquiries, open and total accounts, revolving balance and credit history length.
2. The app derives the debt-to-income and revolving-balance-to-income ratios.
3. Four models return an approval prediction, an interest rate, a credit score and alternative offers.
4. A results page shows the outcome next to D3 visualizations (bubble chart, choropleth map, debt-to-income and employment summaries).

## Data

Lending Club accepted loans, from the public Kaggle dataset "Lending Club" (`accepted_2007_to_2018Q4.csv`). The original cleaned file from the course project was lost, so I rebuilt it with `app/API/prep_data.py`:

- Keep loans issued from 2007 to 2011 (about 42,500 rows, matching the size of the original data).
- Keep only loans that have finished: `Fully Paid` becomes 0 and `Charged Off` becomes 1. Current and late loans have no outcome yet and are dropped.
- Clean the 15 input features (term in months, employment length in years, 3-digit ZIP prefix, credit history in months, debt ratios) and drop rows with missing values.
- Result: 38,708 loans, about 13% charged off.

The first rows of the rebuilt file match the example applicants hard-coded in `creditproject_v3.py`, which is how I checked that this is the same kind of data the team used.

The raw file and the cleaned CSV are not stored in this repository. Download the raw file from Kaggle (see "Running it").

## Models

All four are scikit-learn pipelines (median imputation and min-max scaling for numbers, one-hot encoding for categories). The design is the team's original one.

| Model | What it does | Algorithm |
|---|---|---|
| Approval | Predicts whether a loan like this ends up charged off. A prediction of 1 is shown as "rejected". | K-nearest neighbors classifier, k = 1 |
| Interest rate | Estimates the loan's interest rate | Neural network regressor (MLP, layers 300, 150, 300) |
| Alternative offers | For the same applicant, suggests a loan amount and rate for 36 and 60 months, learned from repaid loans | K-nearest neighbors regressor, k = 1000 |
| Credit score | A 300 to 850 score from ten credit features | One-component SVD, scaled to 300 to 850 |

Note on what "approval" means. The data has no rejected applications, only loan outcomes. So the approval model predicts repayment, and "approved" in the app stands in for "likely to repay". It is a teaching proxy, not a real underwriting decision.

## Results

Evaluation uses a fixed 90/10 split (`random_state=42`). Metrics are printed by `app/API/creditproject_v3.py`.

**Interest rate:** mean absolute error 2.12 percentage points, against 3.04 for always guessing the average rate. R squared is 0.51.

**Approval:** this model is weak.

| Model | ROC AUC | Accuracy | Recall of charged-off loans |
|---|---|---|---|
| KNN k = 1 (used in the app) | 0.521 | 0.782 | 0.169 |

Accuracy is below the 0.870 you would get by predicting "repaid" every time, and an AUC of 0.52 is close to chance. Nearest-neighbor with k = 1 copies the label of one similar loan, which is mostly noise for this problem.

I compared other options on the same split with `app/API/compare_approval_models.py`:

| Model | ROC AUC | Accuracy | Recall |
|---|---|---|---|
| KNN k = 1 (original) | 0.521 | 0.782 | 0.169 |
| KNN k = 100 | 0.595 | 0.870 | 0.000 |
| Logistic regression | 0.633 | 0.629 | 0.540 |
| Logistic regression, no ZIP | 0.650 | 0.649 | 0.538 |
| Gradient boosting | 0.642 | 0.621 | 0.589 |

Logistic regression without the ZIP code was best on AUC. I kept the team's original model in the app on purpose, since this is a course project, but swapping it is a two-line change in `approval_engine`. Accuracy is a poor yardstick here because only 13% of loans are charged off. KNN with k = 100 only reaches the 0.870 baseline by predicting "repaid" for everyone.

**Credit score:** a weighted blend of the inputs scaled to 300 to 850. It is not trained against any outcome and is not validated.

## My contribution

Team project; work was shared across modeling, visualization and the application, and I do not remember the exact split.

## What I changed (2026)

- Rebuilt the training data from the public Lending Club files (`app/API/prep_data.py`).
- Retrained all four models with current scikit-learn and added them to `app/ML_model/`. The originals no longer loaded, and two of the four were missing.
- Added evaluation metrics to the training script and a model comparison script.
- Fixed the removed `sklearn.externals.joblib` import, moved hard-coded secrets to environment variables, added `requirements.txt` and this README.
- Fixed the debt-to-income units: the model is trained on a percent (27.65 means 27.65%), but the app was passing a plain ratio.

## Running it

Requires Python 3. The models were trained with scikit-learn 1.9.1 and pandas 3.1.1.

```
git clone https://github.com/surojitpakira/cse6242-team55.git
cd cse6242-team55
python -m venv .venv
.venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
python -m pip install -r app/requirements.txt
```

The repository already includes trained models, so you can start the app right away:

```
cd app
python app.py
```

Then open http://127.0.0.1:5000. The app must be started from the `app` folder because it loads the models with a relative path.

To rebuild the models from scratch:

1. Download `accepted_2007_to_2018Q4.csv.gz` from the Kaggle "Lending Club" dataset and put it outside the repository.
2. Set the `RAW` path at the top of `app/API/prep_data.py` (or pass the path as an argument) and run `python app/API/prep_data.py`. This writes `app/API/lendingClubCleanData_v3.csv`.
3. From `app/API`, run `python creditproject_v3.py`. This trains the four models, prints the metrics and writes four `.sav` files.
4. Move the `.sav` files to `app/ML_model/`.

The original deployment instructions (Linux VM, nginx, Anaconda, gunicorn) are in `app/README.txt`.

## Known limitations

- The approval model is weak (see Results).
- The data covers loans issued from 2007 to 2011 and is out of date.
- The "Your Total Debt" input is divided by annual income to get DTI. Lending Club's own DTI uses monthly debt payments over monthly income, so the two are not the same measure.
- The form spells one home ownership option "mortage", and the training data uses the same spelling so they match.
- Models were saved with joblib. Load them with a similar scikit-learn version (trained with 1.9.1) or retrain.
- I tested the web app locally on one machine, not in the original Linux deployment.
- `app/API/azure_sql_db.py` is a standalone test script for a database that no longer exists. The app does not use it.
