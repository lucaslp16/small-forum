const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require ('./database/database');
const Question = require ('./database/Question');
const Resposta = require ('./database/Resposta');
//Database
connection
    .authenticate()
    .then(()=>{
        console.log('conexão feita com o bd');
    })
    .catch((msgErro)=>{
        console.log('msgErro');
    })


app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    Question.findAll({
        raw: true,
        order:[
            ['id','DESC'] //ASC = Crescente || DESC = decrescente
        ]
    }).then(quest =>{
        res.render('index',{
            quest:quest
        })
    });
    
})

app.get('/perguntar',(req,res)=>{
    res.render('perguntar')
})

app.post('/salvequestion',(req,res)=>{
    let title = req.body.title;
    let description = req.body.description;

    Question.create({
        title: title,
        description: description
    }).then(()=>{
        res.redirect('/');
    })
});

app.get('/pergunta/:id',(req,res)=>{
    let id = req.params.id;
    //Busca a pergunta de acordo com a ID do BD
    Question.findOne({
        where: {id:id}

    }).then(pergunta=> {
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId:pergunta.id},
                order : [
                    ['id','DESC']
                ]
            }).then(respostas=>{
                res.render('pergunta',{
                    pergunta:pergunta,
                    respostas:respostas
                });
            });
        }else{
            res.redirect('/');
        }
    });
});

app.post('/responder', (req,res)=>{
    let corpo = req.body.corpo;
    let perguntaId = req.body.perguntaId;

    Resposta.create({
        corpo:corpo,
        perguntaId:perguntaId
    }).then(()=>{
        res.redirect('/pergunta/'+perguntaId);
    })
});



app.listen(3000,()=>{
    console.log('iniciando api')
})