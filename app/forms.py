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
    loan_amnt=DecimalField('Loan Amount($)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=14000)
    term = SelectField('Term',choices=[(36,'36 months'), (60,'60 months')],validators=[DataRequired()],coerce=int)
    emp_length=DecimalField('Employment Length(years)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=6)
    home_ownership=SelectField('Home Ownership',coerce=str,choices=[('RENT','RENT'), ('OWN','OWN'),('mortage','mortage'),('others','others')],validators=[DataRequired()])
    annual_inc = DecimalField('Annual Income($)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=70000)
    zip_code =StringField('zip_code(5-digit)',validators=[DataRequired(),Length(min=3,max=5)],render_kw={"placeholder": "XXXXX"},default='00000')
    debt = DecimalField('Your Debt($)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=100000)
    delinq_2yrs = DecimalField('Delinquency in 2yrs',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=1)
    inq_last_6mths = DecimalField('Inquiries in Last 6mths',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=1)
    mths_since_last_delinq=DecimalField('months_since_last_delinquency',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=15)
    open_acc=IntegerField('Open Accounts',[validators.InputRequired('INTEGER required!'),validators.NumberRange(min=0, max=100)],default=10)
    total_acc=IntegerField('Total # of Accounts',[validators.InputRequired('INTEGER required!'),validators.NumberRange(min=0, max=100)],default=25)
    revol_bal=DecimalField('Revolving Balance',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=15000)
    cred_hist_year=DecimalField('Credit History(years)',[validators.DataRequired('FLOAT required!'),validators.NumberRange(min=0)],default=4)
    
    submit = SubmitField('Check it out!')
    
class Dashboard(FlaskForm):
    submit = SubmitField('Run Again!')
    
    
    
    
    
    
    
    
