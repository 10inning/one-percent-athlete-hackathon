import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# AI Services
from AthleteBuddy.Services.plain_llm import plain_llm
from AthleteBuddy.Services.prediction import prediction
from AthleteBuddy.Services.db_tool import db_data_retriever

# DB Actions
from AthleteBuddy.db.actions.get_user import getAthleteDetailsFromDB
from AthleteBuddy.db.actions.update_user import updateAthleteDetailsInDB

@csrf_exempt
def Ask(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        query = data.get("prompt")
        
        intent = prediction(query)
        print(intent)
        
        if intent == "LLM":
            response = plain_llm(query)
            return JsonResponse({"response": response, "res_type": "normal"})
        elif intent == "DB":
            data, table_name = db_data_retriever(query)
            return JsonResponse(
                {"response": data, "res_type": "db", "tablename": table_name}
            )


@csrf_exempt
def GetAthleteProfile(request):
    if request.method == "POST":
        try:
            # Parse JSON from the request body
            data = json.loads(request.body.decode('utf-8'))
            email = data.get("email")
            username = data.get("username")
            
            # Validate input data
            if not email or not username:
                return JsonResponse({"error": "Email and username are required."}, status=400)
            
            # Call the database function to fetch athlete details
            response = getAthleteDetailsFromDB(username, email)
            
            return JsonResponse({"user": response})
        
        except Exception as e:
            # Handle unexpected exceptions gracefully
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    
    # Return 405 Method Not Allowed for non-POST requests
    return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)


@csrf_exempt
def UpdateAthleteProfile(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))    
        details = data.get("athlete_details")
        print(details)
        response = updateAthleteDetailsInDB(details)
        
        if response:
            updated_user_details = getAthleteDetailsFromDB(response.get("username"), response.get("email"))
            print(updated_user_details)
            
        return JsonResponse({"user": updated_user_details})
    
    return JsonResponse({"user": response})