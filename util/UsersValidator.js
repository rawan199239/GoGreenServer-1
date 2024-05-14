const Ajv=require("ajv").default;
const ajv=new Ajv();

const schema={
    "type":"object",
    "properties":{
        "name":{
            "type":"string",
            "pattern":"^[A-Z][a-z]*$"
        },
        "email":{
            "type":"string",
            "pattern":".+\@.+\..+"
        },
        "password":{
            "type":"string",
            "minLength":5
        },
        "phoneNumber": {
            "type": "string",
            "pattern": "^[0-9]{11}$"
          },
    "address": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9\\s,#-]*$"
    },
    },
    "required":["name","password","email","phoneNumber","address"]
}



module.exports=ajv.compile(schema)