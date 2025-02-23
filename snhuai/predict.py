import pandas as pd
from sklearn.linear_model import LinearRegression

# Sample historical data
data = {
    'year': [2020, 2021, 2022],
    'points_earned': [4.5, 5.0, 5.36]
}

# Create a DataFrame
df = pd.DataFrame(data)

# Train the model
model = LinearRegression()
model.fit(df[['year']], df['points_earned'])  # Use df['points_earned'] for single-output regression

# Predict for the year 2023
# Use a DataFrame with the same feature name as during training
prediction_input = pd.DataFrame([[2023]], columns=['year'])  # Ensure feature names match
prediction = model.predict(prediction_input)

print(prediction[0])