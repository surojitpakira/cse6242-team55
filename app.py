# -*- coding: utf-8 -*-

from flask import Flask,render_template,flash,url_for,redirect,request,session
from forms import UserInput,Dashboard
from API import modelAPI
import pandas as pd

app = Flask(__name__)
app.config['SECRET_KEY']='21312312'

# landing page for team project
@app.route("/",methods=['GET','POST'])
def userinput():
    form = UserInput()
    if request.method == "POST":
        if form.validate_on_submit():            
            # save the userinput in the session
            session['userinput']=ParseUserInput(form)
            
            return redirect(url_for('test'))
        
    return render_template('userinput.html',title='Loading',form=form)

@app.route('/test',methods=['GET','POST'])
def test():
#    flash(f'Submitted !','success')

    userinput = session['userinput']
    inputdf= pd.DataFrame.from_dict(userinput,orient='index').T
    
    approval = modelAPI.getApproval(inputdf)
    if approval:
        return "Congrats!"
    else:
        return "SOrry!"

@app.route('/dashboard',methods=['GET','POST'])
def dashboard():
    if 'userinput' not in session:
        return 'Error with your input, please check!'
    ## read user input
    userinput = session.pop('userinput',None)
    inputdf= pd.DataFrame.from_dict(userinput,orient='index').T
    ## check if approval?
    approval = modelAPI.getApproval(inputdf)
    if approval:
        Interest_Rate = modelAPI.getInterestRate(userinput.values)
        Credit_Score = modelAPI.getCreditScore(userinput.values)
        
        return render_template('dashboard.html',title='dashboard',form=form)

    else:
        alternate = modelAPI.getAlternative(userinput.values)
        return render_template('dashboard.html',title='dashboard',form=form)

def ParseUserInput(form):
    ## parse user intput into right format, output the dictionary for ML model
    '''Input: 
            form: from Userinput
       Output:
            output_dict, {}
    '''
    output_dict={}
    
    ## extract user input and clean and save into variable
    loan_amnt                 = float(form.loan_amnt.data)
    term                      = int(form.term.data)
    emp_length                = float(form.emp_length.data)
    home_ownership            = form.home_ownership.data
    annual_inc                = float(form.annual_inc.data)
    zip_code                  = str(form.zip_code.data)[:3]
    debt                      = float(form.debt.data)
    if annual_inc !=0:
        dti = debt/annual_inc
    else:
        dti = 999
    delinq_2yrs               = float(form.delinq_2yrs.data)
    inq_last_6mths            = float(form.inq_last_6mths.data)
    mths_since_last_delinq    = float(form.mths_since_last_delinq.data)
    open_acc                  = int(form.open_acc.data)
    total_acc                 = int(form.total_acc.data)
    revol_bal                 = float(form.revol_bal.data)
    cred_hist_mth             = float(form.cred_hist_year.data)*12
    try:
        revol_bal_to_annual_inc = round(revol_bal/annual_inc,4)
    except ZeroDivisionError:
        revol_bal_to_annual_inc = 999.
    
    output_dict['loan_amnt']=loan_amnt
    output_dict['term']=term
    output_dict['emp_length']=emp_length
    output_dict['home_ownership']=home_ownership
    output_dict['annual_inc']=annual_inc
    output_dict['zip_code']=zip_code
    output_dict['dti']=dti
    output_dict['delinq_2yrs']=delinq_2yrs
    output_dict['inq_last_6mths']=inq_last_6mths
    output_dict['mths_since_last_delinq']=mths_since_last_delinq
    output_dict['open_acc']=open_acc
    output_dict['total_acc']=total_acc
    output_dict['revol_bal']=revol_bal
    output_dict['cred_hist_mth']=cred_hist_mth
    output_dict['revol_bal_to_annual_inc']=revol_bal_to_annual_inc
    
    return output_dict
#    
if __name__ == '__main__':
    app.run(debug=True)