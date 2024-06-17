const Ajv=require("ajv").default;
const ajv=new Ajv();

const schema={
    "type":"object",
    "properties":{
        "name":{
            "type":"string"
        },
        "email":{
            "type":"string"
        },
        "password":{
            "type":"string"
        },
        "phoneNumber": {
            "type": "string"
          },
    "address": {
      "type": "string"
    },
    },
    "required":["name","password","email","phoneNumber","address"]
}



module.exports=ajv.compile(schema)
