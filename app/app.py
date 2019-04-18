# -*- coding: utf-8 -*-

from flask import Flask,render_template,url_for,redirect,request,session
from forms import UserInput
from API import modelAPI
import pandas as pd

app = Flask(__name__)
app.config['SECRET_KEY']='21312312'

# landing page for team project
@app.route("/",methods=['GET','POST'])
def LandingPage():
    
    ## create form from UserInput
    form = UserInput()
    
    ## check for POST 
    if request.method == "POST":
        
        # Validate user input when clicking the submit button
        if form.validate_on_submit():     
            
            # save the userinput in the session so that user input could be retrieved later
            session['userinput']=ParseUserInput(form)
            
            # redirect to the dashboard page
            return redirect(url_for('dashboard'))
        
    return render_template('userinput.html',title='Loading',form=form)

## dashboard
@app.route('/dashboard',methods=['GET','POST'])
def dashboard():

    ## check if user input exists
    if 'userinput' not in session:
        return 'Error with your input, please check!'
    
    ## retrieve user input from session
    userinput = session.pop('userinput',None)

    ## convert user input into Dataframe
    inputdf= pd.DataFrame.from_dict(userinput,orient='index').T
    
    ## check if the loan is approved or not
    approval = modelAPI.getApproval(inputdf)

    ## initialize data    
    data['approval'] = modelAPI.getApproval(inputdf)
    data['interest'] = modelAPI.getInterestRate(inputdf)
    data['Credit_Score'] = modelAPI.getCreditScore(inputdf)
    
    if data['approval'] == 'true':
        data['alt1_amt']='none'
        data['alt1_term']='none'
        data['alt2_amt']='none'
        data['alt2_rate']='none'
    else:
        alternate =modelAPI.getAlternative(inputdf)
        data['alt1_amt']=alternate[0]
        data['alt1_rate']=alternate[1]
        data['alt2_amt']=alternate[2]
        data['alt2_rate']=alternate[3]
        
    return render_template('results_page.html',data=data)

def ParseUserInput(form):
    ''' parse user intput into right format, output the dictionary for ML model
        
        Input: 
            form: from Userinput
        Output:
            output_dict, {}
    '''
    output_dict={}
    
    ## extract user input, clean and save into dictionary
    output_dict['loan_amnt']                = float(form.loan_amnt.data)
    output_dict['term']                     = int(form.term.data)
    output_dict['emp_length']               = float(form.emp_length.data)
    output_dict['home_ownership']           = form.home_ownership.data
    output_dict['annual_inc']               = float(form.annual_inc.data)
    output_dict['zip_code']                 = str(form.zip_code.data)[:3]
    output_dict['debt']                     = float(form.debt.data)
    debt                                    = float(form.debt.data)
    annual_inc                              = float(form.annual_inc.data)
    if annual_inc !=0:
        output_dict['dti']                  = round(debt/annual_inc,2)
    else:
        output_dict['dti']                  = 999
    output_dict['delinq_2yrs']              = float(form.delinq_2yrs.data)
    output_dict['inq_last_6mths']           = float(form.inq_last_6mths.data)
    output_dict['mths_since_last_delinq']   = float(form.mths_since_last_delinq.data)
    output_dict['open_acc']                 = int(form.open_acc.data)
    output_dict['total_acc']                = int(form.total_acc.data)
    output_dict['revol_bal']                = float(form.revol_bal.data)
    output_dict['cred_hist_mth']            = float(form.cred_hist_year.data)*12
    revol_bal                               = float(form.revol_bal.data)
    if annual_inc !=0:
        output_dict['revol_bal_to_annual_inc'] = round(revol_bal/annual_inc,4)
    else:
        output_dict['revol_bal_to_annual_inc'] = 999.
        
    return output_dict
#    
if __name__ == '__main__':
    app.run(debug=True)
