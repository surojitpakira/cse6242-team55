import pandas as pd
import numpy as np
import logging
import timeit
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, MinMaxScaler
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.neural_network import MLPRegressor
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.externals import joblib
from sklearn.decomposition import TruncatedSVD, PCA
from sklearn.metrics import mean_squared_error
import os
logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))

np.random.seed(0)


LOAN_TERM = [36, 60]
STATUS = {'approved': 0, 'rejected': 1}

def ui_prototype():
	#print("Place holder\n")
	columns = ['loan_amnt', 'term', 'emp_length','home_ownership', 'annual_inc',
	                  'zip_code', 'dti', 'delinq_2yrs','inq_last_6mths',
	                  'mths_since_last_delinq', 'open_acc', 'total_acc', 
	                  'revol_bal', 'cred_hist_mth', 'revol_bal_to_annual_inc'  ]
	
	input_example = [ [5000, 36,11,'RENT', 24000.0, 860, 27.65 ,0 ,1 ,0.0 ,3 ,9 ,13648, 322,0.5686666666666667],
	                  [2500, 60, 0,'RENT', 30000.0, 309,   1.0 ,0 ,5 ,0.0 ,3 ,4 ,1687, 152,0.05623333333333334],
	                  [5600, 60,4 , 'OWN', 40000.0, 958,  5.55 ,0 ,2 ,0.0 ,11,13,5210, 91,0.13025],
	                  [5375, 60,0 ,'RENT', 15000.0, 774, 18.08 ,0 ,0 ,0.0 ,2 ,3, 9279, 86,0.6186]]

	input_0 = [[5000, 36,11,'RENT', 24000.0, 860, 27.65 ,0 ,1 ,0.0 ,3 ,9 ,13648, 322,0.5686666666666667]]
	input_1 = [[2500, 60, 0,'RENT', 30000.0, 309,   1.0 ,0 ,5 ,0.0 ,3 ,4 ,1687, 152,0.05623333333333334]]
	userdf = pd.DataFrame(input_1, columns=columns)
	#userdf = pd.DataFrame(input_list, columns=columns)

	return userdf

def alternative_engine(approved_data):
	print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
	logging.info("ALT Model Training Starting ...")

	start = timeit.default_timer()
	

	numeric_features = [ 'term', 'emp_length', 'annual_inc', 'dti', 'delinq_2yrs',
	                    'inq_last_6mths','mths_since_last_delinq', 'open_acc', 'total_acc', 
	                    'revol_bal', 'cred_hist_mth', 'revol_bal_to_annual_inc'  ]
	numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', MinMaxScaler())])

	# Nominal Feature 
	nominal_features = ['home_ownership', 'zip_code']
	nominal_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))])

	preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', nominal_transformer, nominal_features)])

	# Append classifier to preprocessing pipeline.
	# Now we have a full prediction pipeline.
	knnrgs       = Pipeline(steps=[('preprocessor', preprocessor),('knnregressor', KNeighborsRegressor(n_neighbors=1000))])
	X_amn = approved_data.drop(columns = ['loan_amnt','loan_status','int_rate'])
	
	Y_amn = approved_data[['loan_amnt','int_rate']] # 
	X_amn_train, X_amn_test, Y_amn_train, Y_amn_test = train_test_split(X_amn, Y_amn, test_size=0.1)
		

	knnrgs.fit(X_amn_train, Y_amn_train)

	
	filename = 'alternative_model.sav'
	joblib.dump(knnrgs, filename)
	
	#print("ALT Model Score          : %.3f" % knnrgs.score(X_amn_test, Y_amn_test))
	stop = timeit.default_timer()
	print('Model Training Time: ', stop - start)
	print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
	return knnrgs
	

def interest_rate_engine(data):
	print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
	print("Interest Rate Model Training Starting ...")
	start = timeit.default_timer()

	numeric_features = ['loan_amnt', 'term', 'emp_length', 'annual_inc', 'dti', 'delinq_2yrs',
	                    'inq_last_6mths','mths_since_last_delinq', 'open_acc', 'total_acc', 
	                    'revol_bal', 'cred_hist_mth', 'revol_bal_to_annual_inc'  ]
	numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', MinMaxScaler())])

	preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features)])

	#LinearRegression()
	regressor = Pipeline(steps=[('preprocessor', preprocessor),('regressor', MLPRegressor(hidden_layer_sizes=(300,150,300), max_iter=200, 
                    activation='relu', solver='sgd', alpha=0.0001, learning_rate='adaptive', early_stopping=True, verbose=True) )])
	X_int = data.drop(columns = ['loan_status','int_rate','home_ownership', 'zip_code'])
	Y_int = data['int_rate']
	X_int_train, X_int_test, Y_int_train, Y_int_test = train_test_split(X_int, Y_int, test_size=0.1)
	regressor.fit(X_int_train, Y_int_train)
	
	filename = 'interest_rate_model.sav'
	joblib.dump(regressor, filename)
	
	#print("Interest Rate Model Score: %.3f" % regressor.score(X_int_test, Y_int_test))
	stop = timeit.default_timer()
	print('Model Training Time: ', stop - start)
	print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
	return regressor 


def approval_engine(data):
	
	print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")

	print("KNN Approval Model Training Starting ...")
	start = timeit.default_timer()
	#print(datainput.dtypes)

	# Numeric Feature
	numeric_features = ['loan_amnt', 'term', 'emp_length', 'annual_inc', 'dti', 'delinq_2yrs',
	                    'inq_last_6mths','mths_since_last_delinq', 'open_acc', 'total_acc', 
	                    'revol_bal', 'cred_hist_mth', 'revol_bal_to_annual_inc'  ]
	numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', MinMaxScaler())])

	# Nominal Feature 
	nominal_features = ['home_ownership', 'zip_code']
	nominal_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))])

	preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', nominal_transformer, nominal_features)])

	# Append classifier to preprocessing pipeline.
	# Now we have a full prediction pipeline.
	clf       = Pipeline(steps=[('preprocessor', preprocessor),('classifier', KNeighborsClassifier(n_neighbors=1))])
	
	X = data.drop(columns = ['loan_status','int_rate'])
	Y = data['loan_status']
	X_train, X_test, Y_train, Y_test = train_test_split(X, Y,    test_size=0.1)
	#print(X_test.shape, Y_test.shape)
	clf.fit(X_train, Y_train)
	stop = timeit.default_timer()

	print('Model Training Time: ', stop - start)
	
	filename = 'approval_model.sav'
	joblib.dump(clf, filename)
	'''
	print("KNN Approval Model loading Starting ...")
	
	start = timeit.default_timer()
	loaded_model = joblib.load(filename)
	stop = timeit.default_timer()
	print('Model loading Time: ', stop - start)
	'''

	print("Approval Model validation Starting ...")
	start = timeit.default_timer()
	#print("loaded Knn Model Score          : %.3f" % loaded_model.score(X_test, Y_test))
	#print(X_test.shape, Y_test.shape )
	#print("Knn Model Score          : %.3f" % clf.score(X_test, Y_test))

	stop = timeit.default_timer()
	print('Model validation Time: ', stop - start)
	
	return clf

def score_engine(data):
	print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
	print("Credit Score Model Training Starting ...")
	start = timeit.default_timer()

	data = preSVD(data)

	numeric_features = ['emp_length', 'annual_inc', 'dti', 'delinq_2yrs',
	                    'inq_last_6mths', 'open_acc', 'total_acc', 
	                    'revol_bal', 'cred_hist_mth', 'revol_bal_to_annual_inc'  ]
	numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', MinMaxScaler())])


	preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features)])


	svd = TruncatedSVD(n_components=1)
	scaler = MinMaxScaler(copy = True, feature_range=(300, 850))
	score = Pipeline(steps=[('preprocessor', preprocessor),('svd', svd), ('scaler', scaler)])
	scaled_reduced_set = score.fit(data)
	#scaled_test_result = score.transform(x)
	stop = timeit.default_timer()
	print('Model Training Time: ', stop - start)
	print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")

	filename = 'credit_score_model.sav'
	joblib.dump(score, filename)

	return score

def preSVD(data):
	features = ['emp_length', 'annual_inc', 'open_acc', 'total_acc','cred_hist_mth',
	            'dti', 'delinq_2yrs','inq_last_6mths', 'revol_bal', 'revol_bal_to_annual_inc']
	negative_features = ['dti', 'delinq_2yrs','inq_last_6mths', 'revol_bal', 'revol_bal_to_annual_inc'  ]
	data[negative_features] = data[negative_features] * -1.0
	data = data[features]
	return data


if __name__ == '__main__':
	## Load and organize data
	#data = pd.read_csv("cleaned_LoanStats3a_v2.csv" ,header = 0)
	data = pd.read_csv("lendingClubCleanData_v3.csv", header = 0)	
	data = data.iloc[:,1:]
	data = data.drop(columns = ['sub_grade','grade','addr_state'])
	approved_data = data[data['loan_status'] == 0]
	userinput = ui_prototype()
	#print(userinput)

	logging.info("Training Starting...")

	credit_score_generator = score_engine(data)
	approval_predictor     = approval_engine(data)
	interest_predictor     = interest_rate_engine(data)
	alt_preditor           = alternative_engine(approved_data)


	while True:
		start = timeit.default_timer()
		approval_result =         approval_predictor.predict(userinput)
		stop = timeit.default_timer()
		print("Prediction time for Knn: ", stop - start )

		start = timeit.default_timer()
		numerical_input     =         preSVD(userinput)
		
		credit_score    =         credit_score_generator.transform(numerical_input)
		stop = timeit.default_timer()
		print("Prediction time for score: ", stop - start)

		if approval_result[0] == 1:
			localuserinput = userinput.drop(columns = ['loan_amnt'])
			inputdf = pd.DataFrame(np.repeat(localuserinput.values,2,axis=0))
			inputdf.columns = localuserinput.columns
			term = np.asarray(LOAN_TERM)
			inputdf['term'] = term
			start = timeit.default_timer()
			result = alt_preditor.predict(inputdf)
			stop = timeit.default_timer()
			print("Prediction time for alt: ", stop - start)
			print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
			print("You have a credit score of ", int(credit_score[0][0]))
			print("LOAN APPLICATION REJECTED.\n")
			print("ALT 1")
			print("Loan_amnt: ", int(result[0][0]) )
			print("Loan_term: 36" )
			print("interest rate: ",round(result[0][1],2) )
			print("")
			print("ALT 2")
			print("Loan_amnt: ", int(result[1][0]) )
			print("Loan_term: 60" )
			print("interest rate: ",round(result[1][1],2) )
			print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
			print(" ")
			exit()
		else:
			
			print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
			print("You have a credit score of ", int(credit_score[0][0]))
			print("Congrats. You are qualified for a loan.\n")

			start = timeit.default_timer()
			interest_rate = interest_predictor.predict(userinput)
			stop = timeit.default_timer()
			print("predict time for int_rate: ", stop - start)
			print("Your estimate annual interest rate is ", round(interest_rate[0],2) , "%")
			
			localuserinput = userinput.drop(columns = ['loan_amnt'])
			inputdf = pd.DataFrame(np.repeat(localuserinput.values,2,axis=0))
			inputdf.columns = localuserinput.columns
			term = np.asarray(LOAN_TERM)
			inputdf['term'] = term
			result = alt_preditor.predict(inputdf)

			print("ALT 1")
			print("loan_amnt: ", int(result[0][0]) )
			print("loan_term: 36" )
			print("interest rate: ",round(result[0][1],2) )
			print("")
			print("ALT 2")
			print("loan_amnt: ", int(result[1][0]) )
			print("loan_term: 60" )
			print("interest rate: ",round(result[1][1],2) )
			print("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
			exit()





