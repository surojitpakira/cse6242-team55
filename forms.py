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
    loan_amnt=DecimalField('loan amount($)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=14000)
    term = SelectField('term',choices=[(36,'36 months'), (60,'60 months')],validators=[DataRequired()],coerce=int)
    emp_length=DecimalField('employment length',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)],default=6)
    home_ownership=SelectField('home_ownership',coerce=str,choices=[('RENT','RENT'), ('OWN','OWN'),('mortage','mortage'),('others','others')],validators=[DataRequired()])
    annual_inc = DecimalField('annual_income($)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)])
    zip_code =StringField('zip_code(5-digit)',validators=[DataRequired(),Length(min=3,max=5)])
    debt = DecimalField('your debt($)',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)])
    delinq_2yrs = DecimalField('delinq_2yrs',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)])
    inq_last_6mths = DecimalField('inq_last_6mths',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)])
    mths_since_last_delinq=DecimalField('mths_since_last_delinq',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)])
    open_acc=IntegerField('open_account',[validators.InputRequired('INTEGER required!'),validators.NumberRange(min=0, max=100)])
    total_acc=IntegerField('total_account',[validators.InputRequired('INTEGER required!'),validators.NumberRange(min=0, max=100)])
    revol_bal=DecimalField('revol_balance',[validators.InputRequired('FLOAT required!'),validators.NumberRange(min=0)])
    cred_hist_year=DecimalField('credit history(years)',[validators.DataRequired('FLOAT required!'),validators.NumberRange(min=0)])
    
    submit = SubmitField('Check it out!')
    
class Dashboard(FlaskForm):
    submit = SubmitField('Run Again!')
    
    
    
    
    
    
    
    