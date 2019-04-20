# -*- coding: utf-8 -*-
"""
Created on Wed Mar 27 23:26:19 2019

@author: victor
"""

from flask_wtf import FlaskForm
from wtforms import SubmitField,DecimalField,IntegerField,SelectField,StringField
from wtforms.validators import DataRequired,Length
from wtforms import validators

# User input 
class UserInput(FlaskForm):
    loan_amnt=DecimalField('Requested Loan Amount (in $)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=14000)
    term = SelectField('Length of Requested Loan',choices=[(36,'36 months'), (60,'60 months')],validators=[DataRequired()],coerce=int)
    emp_length=DecimalField('Your Employment Length (in years)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=6)
    home_ownership=SelectField('Your Home Situation',coerce=str,choices=[('RENT','RENT'), ('OWN','OWN'),('mortage','mortage'),('others','others')],validators=[DataRequired()])
    annual_inc = DecimalField('Your Annual Income (in $)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=70000)
    zip_code =StringField('Your Zip Code',validators=[DataRequired(),Length(min=3,max=5)],render_kw={"placeholder": "XXXXX"},default='00000')
    debt = DecimalField('Your Total Debt (in $)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=100000)
    delinq_2yrs = DecimalField('# of Delinquencies / Last 2 Years',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=1)
    inq_last_6mths = DecimalField('# of Credit Inquiries / Last 6 months',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=1)
    mths_since_last_delinq=DecimalField('Months Since Last Delinquency',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=15)
    open_acc=IntegerField('Total # of Your Open Accounts',[validators.InputRequired('INTEGER required!'),validators.NumberRange(min=0, max=100)],default=10)
    total_acc=IntegerField('Total # of Past and Current Accounts',[validators.InputRequired('INTEGER required!'),validators.NumberRange(min=0, max=100)],default=25)
    revol_bal=DecimalField('Your Total Revolving Balance',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=15000)
    cred_hist_year=DecimalField('Length of Your Credit History (in years)',[validators.DataRequired('FLOAT required!'),validators.NumberRange(min=0)],default=4)
    
    submit = SubmitField('Check it out!')
    
class Dashboard(FlaskForm):
    submit = SubmitField('Run Again!')
    
    
    
    
    
    
    
    
