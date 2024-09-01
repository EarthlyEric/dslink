import { apiEndpoint } from "../config";

//**
* {
  "type":"statistic",
  "route":{
      "api":{
          "/generate":{
              "sucess":databaseSystemResult["route"]["api"]["/generate"]["sucess"],
              "fail":databaseSystemResult["route"]["api"]["/generate"]["fail"]
              },
          "/lookup":{
              "sucess":databaseSystemResult["route"]["api"]["/lookup"]["sucess"],
              "fail":databaseSystemResult["route"]["api"]["/lookup"]["fail"]
          },
          "/health":databaseSystemResult["route"]["api"]["/health"],
          "/info":databaseSystemResult["route"]["api"]["/info"],
          "/statistic":databaseSystemResult["route"]["api"]["/statistic"]
          },
      "web":{
          "redirect":{
              "sucess":databaseSystemResult["route"]["web"]["redirect"]["sucess"],
              "fail":databaseSystemResult["route"]["web"]["redirect"]["fail"]
          }
      },
      "links":{"totals":links}
  }
  })


export default function apiStatus() {
    function getApiStatus() {
        return fetch(apiEndpoint + '/api/status')
            .then((response) => response.json())
            .then((data) => {
                return data;
            });
    }
  return (
    <div></div>
  );
}