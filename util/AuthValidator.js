const Ajv=require("ajv").default;
const ajv=new Ajv();

const schema={
    "type":"object",
    "properties":{

        "email":{
            "type":"string",
            "pattern":".+\@.+\..+"
        },
        "password":{
            "type":"string",
            "minLength":5,
            "maxLength":1024
        }

    },
    "required":["password","email"]
}



module.exports=ajv.compile(schema)