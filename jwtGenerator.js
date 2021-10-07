import { sign } from 'jsonwebtoken';
require('dotenv').config();

function jwtGenerator(id) {

    const payload = { user: id }

    return sign(payload, process.env.JWT_SECRET, {expiresIn: "1hr"})

    
}

export default jwtGenerator;