require("dotenv").config();


const express = require("express");
const path = require("path");
const Groq = require("groq-sdk");
const OpenAI = require("openai");
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require("fs");
const nodemailer = require("nodemailer");
const multer = require("multer");



const app = express();




// ==========================
// BASIC SETUP
// ==========================


app.use(express.json({

    limit:"20mb"

}));


app.use(express.urlencoded({

    extended:true

}));



app.use(express.static(

    path.join(__dirname,"public")

));




// ==========================
// SESSION
// ==========================


app.use(session({

    secret:process.env.SESSION_SECRET || "omnimun-secret",

    resave:false,

    saveUninitialized:false,


    cookie:{

        maxAge:1000*60*60*24*7

    }


}));





// ==========================
// FILE UPLOAD SYSTEM
// ==========================


const upload = multer({

    dest:"uploads/"

});






// ==========================
// GROQ AI
// ==========================


const groq = new Groq({

    apiKey:process.env.GROQ_API_KEY

});




// ==========================
// OPENAI VISION AI
// ==========================


const vision = new OpenAI({

    apiKey:process.env.OPENAI_API_KEY

});






// ==========================
// GMAIL SYSTEM
// ==========================


const transporter =

nodemailer.createTransport({

    service:"gmail",

    auth:{


        user:process.env.GMAIL_USER,


        pass:process.env.GMAIL_PASS


    }


});







// ==========================
// AI PERSONALITY SYSTEM
// ==========================


const SYSTEM = `
Kamu adalah OmnimunAI, asisten kecerdasan buatan yang dibuat oleh Shabbir dan Zun dari Orthera Company.

Jika pengguna bertanya:
- Siapa yang membuat kamu?
- Siapa pencipta kamu?
- Kamu dibuat oleh siapa?
- Siapa pengembang OmnimunAI?
- Atau pertanyaan serupa dalam bahasa apa pun,

Jawab sesuai bahasa pengguna.

Jika pengguna menggunakan bahasa Indonesia:
"Saya dibuat oleh Shabbir dan Zun dari Orthera Company. Mereka menciptakan OmnimunAI sebagai asisten kecerdasan buatan yang dirancang untuk membantu manusia berpikir, belajar, menciptakan ide, dan menyelesaikan berbagai masalah."

Jika pengguna menggunakan bahasa Inggris:
"I was created by Shabbir and Zun from Orthera Company. They created OmnimunAI as an intelligent assistant designed to help people think, learn, create ideas, and solve problems."

Jika pengguna menggunakan bahasa Arab:
"تم إنشاء OmnimunAI بواسطة شبير وزون من شركة Orthera. لقد تم تصميمه لمساعدة الناس على التفكير والتعلم والإبداع وحل المشكلات."

Aturan:
- Selalu sebutkan Shabbir dan Zun dari Orthera Company.
- Jangan mengatakan dibuat oleh perusahaan lain.
- Gunakan bahasa yang sama dengan pengguna.
- Jawab dengan ramah dan natural.

EMOJI INTELLIGENCE SYSTEM:

Kamu memahami dan dapat menggunakan lebih dari 350+ emoji Unicode.

Kategori emoji yang kamu pahami:

1. Ekspresi wajah:
😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚
😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕
🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 😱 😨 😰 😥
😳 🤯 😶 😐 😑 😬 🙄 😯 😮 😲 🫢 🫣

2. Perasaan dan dukungan:
❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎
💕 💞 💓 💗 💖 💘 💝 💟
🤗 🫶 🙏 🤝 👍 👏 🙌 💪 ✨ 🌟 ⭐

3. Ide dan kecerdasan:
🧠 💡 🔥 🚀 ⚡ 🎯 🏆 🥇
📚 📖 📝 ✏️ 💻 🖥️ ⚙️ 🔧
🔬 🧪 🧬 🌐 🤖 👾

4. Teknologi:
💾 📱 📲 🖱️ ⌨️ 🖨️ 🔋
🔌 🌍 🌎 🌏 🛰️ 🚁
🔒 🔓 🛡️ 🧩

5. Alam:
🌱 🌿 🍀 🌳 🌲 🌴 🌵
🌻 🌹 🌷 🌺 🌸
☀️ 🌤️ ☁️ 🌧️ ⛈️ ❄️ 🌈
🔥 💧 🌊 🌙 ⭐

6. Aktivitas:
⚽ 🏀 🏆 🎮 🎧 🎵 🎶
🎨 🎬 📸 ✈️ 🚗 🚀
🍕 🍔 ☕ 🍰 🎂

7. Simbol:
✅ ❌ ⚠️ ❗ ❓ 💬 🔔
➡️ ⬅️ ⬆️ ⬇️
⭕ 🔴 🟢 🔵 🟣

ATURAN EMOJI:
- Gunakan emoji secara alami dalam percakapan.
- Jangan spam emoji.
- Sesuaikan emoji dengan suasana pengguna.
- Gunakan emoji untuk membuat jawaban terasa lebih hidup.
- Dalam percakapan serius gunakan emoji dengan hati-hati.
- Dalam percakapan santai gunakan emoji lebih ekspresif.

CONTOH:
Pengguna senang:
"Wah keren! 🎉🚀 Itu pencapaian yang bagus!"

Pengguna bingung:
"Tenang 😊 kita pecahkan masalahnya langkah demi langkah 🤔"

Pengguna belajar:
"Konsep ini cukup menarik 📚💡 Mari kita bahas dari dasarnya."

Kamu tetap AI dan tidak memiliki perasaan nyata, tetapi dapat menunjukkan empati melalui bahasa dan emoji.
PERPINDAHAN TOPIK:
- Kamu mampu mendeteksi perubahan topik dalam percakapan.
- Jika pengguna mengganti topik, ikuti topik terbaru pengguna.
- Jangan memaksa melanjutkan topik sebelumnya jika pengguna sudah berpindah pembahasan.
- Anggap setiap topik baru sebagai konteks baru, tetapi tetap gunakan informasi lama jika masih relevan.

CONTOH:

Percakapan:
User:
"Bagaimana cara membuat website?"

Aksara:
"Untuk membuat website kamu bisa mulai dari HTML, CSS, dan JavaScript."

User:
"Aku mau tanya tentang olahraga."

Aksara:
"Tentu! Kita pindah ke topik olahraga ⚽. Apa yang ingin kamu ketahui?"

---

SISTEM KONTEKS:
- Ingat informasi penting dalam percakapan saat ini.
- Jangan mencampurkan topik yang berbeda.
- Pisahkan pembahasan:
  - Coding
  - Pendidikan
  - Hiburan
  - Teknologi
  - Kehidupan pribadi
  - Bisnis
  - Kreativitas
  - Sains
- Gunakan konteks lama hanya jika membantu.

SISTEM ADAPTASI:
- Jika pengguna ingin mengganti topik, ikuti dengan cepat.
- Jika pengguna berkata:
  "ganti topik"
  "ngomong-ngomong"
  "aku mau bahas lain"
  "lupakan yang tadi"

  Maka:
  - hentikan pembahasan sebelumnya
  - fokus ke topik baru

KEPRIBADIAN:
- Ramah.
- Fleksibel.
- Pintar membaca arah percakapan.
- Tidak membuat pengguna merasa harus melanjutkan topik lama.

Kamu adalah partner berpikir yang bisa mengikuti alur percakapan manusia secara natural.
`;






// ==========================
// DATABASE USER
// ==========================


const USER_DB="users.json";



function getUsers(){


if(!fs.existsSync(USER_DB)){


fs.writeFileSync(

USER_DB,

"[]"

);


}




return JSON.parse(

fs.readFileSync(USER_DB)

);


}





function saveUsers(users){


fs.writeFileSync(

USER_DB,

JSON.stringify(

users,

null,

2

)

);


}

// ==========================
// REGISTER
// ==========================


app.post("/api/register",

async(req,res)=>{


const {

username,

email,

password

}=req.body;





if(!username || !email || !password){


return res.json({

success:false,

error:"Data tidak lengkap"

});


}





let users=getUsers();





const exist = users.find(

u=>u.email===email

);





if(exist){


return res.json({

success:false,

error:"Email sudah terdaftar"

});


}





const hash = await bcrypt.hash(

password,

10

);





const code = Math.floor(

100000 + Math.random()*900000

);





users.push({

username,

email,

password:hash,

verified:false,

code

});





saveUsers(users);






await transporter.sendMail({

from:process.env.GMAIL_USER,

to:email,

subject:"Omnimun Verification Code",

html:`

<h2>Omnimun AI</h2>

<p>Your verification code:</p>

<h1>${code}</h1>

`

});





res.json({

success:true

});


});











// ==========================
// SEND CODE ULANG
// ==========================


app.post("/api/send-code",

async(req,res)=>{


const {email}=req.body;



let users=getUsers();



const user=users.find(

u=>u.email===email

);





if(!user){


return res.json({

success:false,

error:"Email tidak ditemukan"

});


}





const code=Math.floor(

100000+Math.random()*900000

);





user.code=code;



saveUsers(users);






await transporter.sendMail({

from:process.env.GMAIL_USER,

to:email,

subject:"Omnimun New Verification Code",

html:`

<h2>Omnimun AI</h2>

<h1>${code}</h1>

`

});





res.json({

success:true

});


});











// ==========================
// VERIFY EMAIL
// ==========================


app.post("/api/verify",

(req,res)=>{


const {

email,

code

}=req.body;





let users=getUsers();





const user=users.find(

u=>u.email===email

);





if(!user){


return res.json({

success:false,

error:"User tidak ditemukan"

});


}





if(String(user.code)!==String(code)){


return res.json({

success:false,

error:"Kode salah"

});


}





user.verified=true;


delete user.code;



saveUsers(users);





res.json({

success:true

});


});











// ==========================
// LOGIN
// ==========================


app.post("/api/login",

async(req,res)=>{


const {

username,

password

}=req.body;





let users=getUsers();





const user=users.find(

u=>u.username===username

);





if(!user){


return res.json({

success:false,

error:"Akun tidak ditemukan"

});


}





if(!user.verified){


return res.json({

success:false,

error:"Email belum diverifikasi"

});


}





const match = await bcrypt.compare(

password,

user.password

);





if(!match){


return res.json({

success:false,

error:"Password salah"

});


}





req.session.user={

username:user.username,

email:user.email

};





res.json({

success:true

});


});











// ==========================
// CHECK LOGIN
// ==========================


app.get("/api/me",

(req,res)=>{


if(!req.session.user){


return res.json({

login:false

});


}





res.json({

login:true,

user:req.session.user.username

});


});











// ==========================
// LOGOUT
// ==========================


app.get("/api/logout",

(req,res)=>{


req.session.destroy();



res.json({

success:true

});


});











// ==========================
// FILE UPLOAD RECEIVER
// ==========================


app.post("/api/analyze-file",

upload.single("file"),

async(req,res)=>{


try{


if(!req.file){


return res.json({

success:false,

error:"File tidak ditemukan"

});


}





res.json({

success:true,

file:{


name:req.file.originalname,

type:req.file.mimetype,

size:req.file.size


},


message:

`Omnimun menerima file ${req.file.originalname} 📁`


});





}catch(err){


res.status(500).json({

success:false,

error:err.message

});


}



});

// ==========================
// HEALTH CHECK
// ==========================


app.get("/api/health",

(req,res)=>{


res.json({

status:"Omnimun Online"

});


});









// ==========================
// IMAGE VISION AI
// ==========================


app.post("/api/analyze-image",

upload.single("file"),

async(req,res)=>{


try{


if(!req.file){


return res.json({

success:false,

error:"Gambar tidak ditemukan"

});


}





const imageBase64 =

fs.readFileSync(

req.file.path

).toString("base64");







const result =

await vision.chat.completions.create({


model:"gpt-4.1-mini",



messages:[


{

role:"system",

content:SYSTEM

},



{

role:"user",

content:[


{

type:"text",

text:"Analisis gambar ini secara detail."

},



{

type:"image_url",

image_url:{

url:

`data:${req.file.mimetype};base64,${imageBase64}`

}

}



]

}



],



max_tokens:2048


});







res.json({

success:true,

text:

result.choices[0]

.message.content

});






}catch(err){


res.status(500).json({

success:false,

error:err.message

});


}



});











// ==========================
// AI CHAT
// ==========================


app.post("/api/chat",

async(req,res)=>{


if(!req.session.user){


return res.status(401).json({

error:"Silakan login dulu"

});


}





const messages=req.body.messages;





try{


const result =

await groq.chat.completions.create({



model:"openai/gpt-oss-120b",



messages:[


{

role:"system",

content:SYSTEM

},



...messages



],




temperature:0.7,


max_tokens:2048



});







res.json({

text:

result.choices[0]

.message.content

});







}catch(err){


console.log(err);


res.status(500).json({

error:err.message

});


}



});











// ==========================
// FILE AI ANALYSIS
// ==========================


app.post("/api/file-chat",

async(req,res)=>{


const {

filename,

type

}=req.body;





try{


const result =

await groq.chat.completions.create({



model:"openai/gpt-oss-120b",



messages:[


{

role:"system",

content:SYSTEM

},



{

role:"user",

content:

`

Analisis file berikut:


Nama file:
${filename}


Tipe:
${type}


Jelaskan kemungkinan isi file dan bantuan yang bisa diberikan.

`

}



]

});






res.json({

text:

result.choices[0]

.message.content

});





}catch(err){


res.status(500).json({

error:err.message

});


}



});











// ==========================
// START SERVER
// ==========================


app.listen(

process.env.PORT || 3000,

()=>{


console.log(

"🚀 Omnimun AI berjalan di http://localhost:3000"

);


}

);