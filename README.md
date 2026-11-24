# P2P Loan Application Predictor (CSE 6242, Team 55)

Team project for Georgia Tech CSE 6242 (Data and Visual Analytics), built by a team of 3 to 4 students. A web app where a user enters basic loan application details and sees a predicted approval decision, an estimated interest rate, a credit score and, if the loan is not approved, two alternative loan offers (36 and 60 month terms). Interactive D3 charts show how applicants compare on debt-to-income ratio, employment length and region.

## What it does

1. The user fills in a form: loan amount, term, employment length, home ownership, annual income, ZIP code, debt, delinquencies, recent credit inquiries, open and total accounts, revolving balance and credit history length.
2. The app derives debt-to-income and revolving-balance-to-income ratios.
3. Four models return an approval prediction, an interest rate, a credit score and alternative offers.
4. A results page shows the outcome next to D3 visualizations (bubble chart, choropleth map, debt-to-income and employment summaries).

## Approach

- **Data:** the feature names match Lending Club loan data (loan amount, term, DTI, delinquencies, revolving balance). [Confirm the source and time period.]
- **Models (scikit-learn pipelines):** median imputation and min-max scaling for numeric features, one-hot encoding for home ownership and ZIP prefix. Approval is a classifier, the interest rate is a regressor, the alternative offers use a K-nearest-neighbors regressor, and the credit score uses a dimensionality-reduction model (SVD) over the credit features. [Confirm which algorithm each final model uses.]
- **App:** Flask, with a small API module that loads the saved models, and D3 (v3) for charts.

## Results

[Add evaluation metrics here: approval accuracy or AUC, interest rate error, and how the data was split. These are not recorded in the repository.]

## My contribution

Team project; work was shared across modeling, visualization and the application. [Add specifics if you recover them from the final report or slides.]

## Running it

The original instructions (Linux VM, nginx, Anaconda, gunicorn) are in `app/README.txt`.

Known issues with the repository as it stands:

- Only two of the four saved models are included (`interest_rate_model.sav` and `credit_score_model.sav`). The approval and alternative-offer models are missing, so `app/API/modelAPI.py` fails when it loads them.
- The saved models were written with scikit-learn 0.20.1 and do not load in current versions.
- `modelAPI.py` and `creditproject_v3.py` import `sklearn.externals.joblib`, which no longer exists. Use `import joblib` instead.
- The cleaned training data (`lendingClubCleanData_v3.csv`) is not in the repository, so the models cannot be retrained from it.
- Secrets are hard-coded in the source (a database connection in `app/API/azure_sql_db.py` and a Flask secret key in `app/app.py`). Move them to environment variables.

To get it running again: download the Lending Club data, re-run the training steps in `app/API/creditproject_v3.py` with a current scikit-learn to regenerate all four models, update the joblib import, and start the app with `flask run` or gunicorn.
