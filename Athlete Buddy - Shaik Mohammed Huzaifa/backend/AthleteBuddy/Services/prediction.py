from .llm_service import LLM
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

def prediction(query):
    llm_instance = LLM(token_limit=3,model="gpt-4o-mini")
    llm = llm_instance.get_llm()

    template = """
        You are a assistant how help predict the intent of the user query. 
        
        So the user query will have two kinds of intents 
        1. LLM - which will be normal queries a llm can answer without knowledgebase
        2. DB - where the data is been searched on database and the response is given
        
        
        Your response should be either just the Intent nothing else like explaination or anything. Just LLM or DB 
        
        Example Query and intents: 
            Query, Intent
            Looking for a amaetur football partner, DB
            Who currently holds the record of fastest 100m sprint, LLM
            Find me a beginner level trainer for rugby, DB
            Suggest me the process of joining a international FIFA team, LLM
            Find me some best football players, DB
            Find me a professional football player, DB
        
        
        Here is the User Query: {Query}   
    """

    output_parser = StrOutputParser()

    prompt = ChatPromptTemplate.from_template(template)

    chain = prompt | llm | output_parser

    return chain.invoke({"Query": query})
