import { PeopleWidget } from "../People Widget/PeopleWidget.component";

export const Prompt = ({ prompt, type }) => {
  console.log(`RealPrompt: ${prompt}`);

  const { response, tablename, res_type } = prompt?.prompt || {};

  return (
    <div className={`prompt ${type}`}>
      {prompt.type === "user" ? (
        <p>{prompt.prompt}</p>
      ) : (
        <>
          {tablename === "athlete_details" && (
            <PeopleWidget athlete_details={response} />
          )}
          {res_type === "normal" && <p>My Rsp: {response}</p>}
        </>
      )}
    </div>
  );
};
