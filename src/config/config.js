import dotenv from 'dotenv'
dotenv.config();
let config = () => {};

// config.PORT = 8090;
// config.Mongo_URL = "mongodb+srv://preeti:dd4KkHB4MygpaXsN@cluster0.4emms.mongodb.net/DataSenseX";
// config.Mongo_URL = "mongodb+srv://sureshkumar1202028:suresh9234@cluster0.v42mwb3.mongodb.net";
// config.APIKEY = `API-DATASenseX-123`;
// config.SessionID = `Session-DATASenseX-123`;

config.PORT = process.env.PORT;
config.Mongo_URL = process.env.Mongo_URL;
config.APIKEY = process.env.APIKEY;
config.SessionID = process.env.SessionID;
config.secret = process.env.secret;


export default config ;
