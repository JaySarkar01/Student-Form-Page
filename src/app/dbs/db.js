import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;
let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise:null};
}

async function connect() {
    if(cached.conn) {
        return cached.conn;
    }

    if(!cached.promise){
        cached.promise = mongoose.connect(URI).then((mongooseInstance) => {
            return mongooseInstance;
        })
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connect;

