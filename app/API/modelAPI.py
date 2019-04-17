import pandas as pd
import numpy as np
from sklearn.externals import joblib
import timeit

## Reference
## https://www.linode.com/docs/applications/big-data/how-to-move-machine-learning-model-to-production/
## https://www.datacamp.com/community/tutorials/machine-learning-models-api-python
## *args and **kwargs

##########  This following section should be put at the begginning of flask app.py  #####################
SHELF = {
    'approval'     :'ML_model/approval_model.sav',
    'interest_rate':'ML_model/interest_rate_model.sav',
    'alternative'  :'ML_model/alternative_model.sav',
    'creditscore'  :'ML_model/credit_score_model.sav'
}

APPROVAL     = joblib.load( SHELF['approval'] )
INTERESTRATE = joblib.load( SHELF['interest_rate'] )
ALTERNATIVE  = joblib.load( SHELF['alternative'] )
CREDITSCORE  = joblib.load( SHELF['creditscore'] )

COLUMNS = ['loan_amnt', 'term', 'emp_length','home_ownership', 'annual_inc',
            'zip_code', 'dti', 'delinq_2yrs','inq_last_6mths','mths_since_last_delinq',
            'open_acc', 'total_acc', 'revol_bal', 'cred_hist_mth', 'revol_bal_to_annual_inc'  ]

LOAN_TERM = [36, 60]

#########################################################################################################
# Preprocess for credit score
def preprocessSVD(inputdf):
    features          =   ['emp_length', 'annual_inc', 'open_acc', 'total_acc','cred_hist_mth',
                           'dti', 'delinq_2yrs','inq_last_6mths', 'revol_bal', 'revol_bal_to_annual_inc']
    negative_features =   ['dti', 'delinq_2yrs','inq_last_6mths', 'revol_bal', 'revol_bal_to_annual_inc'  ]
    inputdf[negative_features] = inputdf[negative_features] * -1.0
    inputdf = inputdf[features]
    return inputdf

# Preprocess for alternative proposal process. The output will be two records with different terms
def preprocessAlt(inputdf):
    tempinput = inputdf.drop(columns = ['loan_amnt'])
    outdf = pd.DataFrame(np.repeat(tempinput.values,2,axis=0))
    outdf.columns = tempinput.columns
    term = np.asarray(LOAN_TERM)
    outdf['term'] = term
    return outdf

# Binary output: 1 means rejected. 0 means approved.
def getApproval(inputdf):
    ''' Check if your loan would be approved or not
    
    Input:
        inputdf: user input dataframe
    
    Output:
        True or False
    '''
    result = APPROVAL.predict(inputdf)
    if result[0] == 0:
        return True
    else:
        return False

def getInterestRate(inputdf):
    ''' Check your Interest rate is your loan is approved
    Input:
        inputdf: user input dataframe
    
    Output:
        interest_rate (Float)
    
    '''
    result = INTERESTRATE.predict(inputdf)
    return round(result[0],2)

# The input is a df with two rows and the outouts are 36 month loan amount, 36 month interest rates, 60 month loan amount, 60 month interest rates 
def getAlternative(inputdf):
    ''' Alternative loan amnt if rejected
    
    Input: 
        inputdf: user input dataframe
    output:
        (altamount1, altrate1, altamount2, altrate2)
    '''
    alt_input = preprocessAlt( inputdf )
    result = ALTERNATIVE.predict(alt_input)
    return int(result[0][0]), round(result[0][1],2), int(result[1][0]), round(result[1][1],2)

def getCreditScore(inputdf):
    ''' get your credit score
    
    Input: 
        inputdf: user input dataframe
    output:
        Credit_Score (INTEGER)
    '''
    credit_socre_input = preprocessSVD( inputdf )
    result = CREDITSCORE.transform(credit_socre_input)
    return int(result[0][0])

#def main():
#
#    # Two examples for testing
#    userinput                                  = getInput( '5000', '36', '11', 'RENT', '24000', '86005', '27.65', '0', '1', '0', '3', '9', '13648','322')
#    #userinput                                  = getInput( '10000', '60', '0', 'RENT', '30000', '30919', '1.0', '0', '5', '0', '3', '4', '1687','152')
#    approval_result                            = getApproval( userinput )
#    credit_socre_input                         = preprocessSVD( userinput )
#    credit_score                               = getCreditScore( credit_socre_input )
#    alt_input                                  = preprocessAlt( userinput )
#    altamount1, altrate1, altamount2, altrate2 = getAlternative( alt_input )
#    if approval_result == 'APPROVED':
#        interest_rate = getInterestRate( userinput )
#        print("----------------------------------------")
#        print("Approval Result  : ", approval_result)
#        print("Qualified Rates  : ", interest_rate)
#        print("Credit Score     : ", credit_score)
#        print("Alt1 Loan Amount : ", altamount1 )
#        print("Alt1 Loan Term   :  36" )
#        print("Alt1 Loan Rate   : ", altrate1, "%" )
#        print("Alt2 Loan Amount : ", altamount2 )
#        print("Alt2 Loan Term   :  60" )
#        print("Alt2 Loan Rate   : ", altrate2, "%" )
#        print("-----------------------------------------")
#    else:
#        print("-----------------------------------------")
#        print("Approval Result  : ", approval_result)
#        print("Credit Score     : ", credit_score)
#        print("Alt1 Loan Amount : ", altamount1 )
#        print("Alt1 Loan Term   :  36" )
#        print("Alt1 Loan Rate   : ", altrate1 ,"%")
#        print("Alt2 Loan Amount : ", altamount2 )
#        print("Alt2 Loan Term   :  60" )
#        print("Alt2 Loan Rate   : ", altrate2 ,"%")
#        print("-----------------------------------------")