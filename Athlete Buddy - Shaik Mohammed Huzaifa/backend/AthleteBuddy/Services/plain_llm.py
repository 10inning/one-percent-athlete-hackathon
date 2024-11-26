from .llm_service import LLM 
from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser

def plain_llm(Query):
    llm_instance = LLM(model='gpt-4o-mini', token_limit=3000)
    llm = llm_instance.get_llm()
    
    output_str_parser = StrOutputParser()
    
    template = """
        You are a Assistant who help Athletes in planning their diets, routines, workouts and much more
        
        
        Athlete Query = {query}
    """
    
    prompt = PromptTemplate.from_template(template)
    
    chain = prompt | llm | output_str_parser
    
    return chain.invoke({"query": Query})