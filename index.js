const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const HOST_NAME = "172.17.0.5"

const SELECT_ALL_PRODUCTS_QUERY = 'select * from keyword_live_male;';
const SELECT_ALL_MAP_NODE_QUERY = 'select * from youtube_map_node';
const SELECT_ALL_MAP_EDGE_QUERY = 'select * from youtube_map_edge';



const connection = mysql.createConnection({
    host: '101.101.217.206',
    user: 'trendup',
    password: '2020',
    database: 'dbtrendup'

});

connection.connect(err=>{
    if(err){
        return err;
    }
});

function mean_func (lst) {
  var i;
  var sum = 0;
    for( i = 0; i < lst.length ; i++){
        sum += lst[i]
    }
    return sum/(lst.length);
}

function is_increasing_fun (lst) {
    var max_2016 = lst[0];
    var i;
    var times = 0;
    for( i=1; i< lst.length; i++){
        if(lst[i]>max_2016){
            times++;
        }
    }

    return (times >= 2)
}

app.use(cors());

app.get('/',(req,res) => {
    res.send('go to /products to see result')
});

app.get('/node',(req,res) => {
    connection.query(SELECT_ALL_MAP_NODE_QUERY, (err, results) => {
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results.map(
                    x => {
                      return {
                        id : x["channel_id"],
                        size: 1,
                        label: `${x["title"]}(${x["subscriber_count"]})`
                      }
                    }
                  )
            })
        }
    });
});

app.get('/edge',(req,res) => {
    connection.query(SELECT_ALL_MAP_EDGE_QUERY, (err, results) => {
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results.map(
                    x => {
                      return {
                        id: `${x["source_id"]}${x["target_id"]}`,
                        source: x["source_id"],
                        target: x["target_id"],
                        size: x["size"]
                      }
                    }
                    )
            })
        }
    });
});

app.get('/raw',(req,res) => {
    const {keyword} = req.query;
    const SELECT_ALL_KEYWORD_DATAFEATURE = `select * from ${keyword}_RawData;`

    connection.query(SELECT_ALL_KEYWORD_DATAFEATURE, (err, results) => {
        if(err){
            return res.send(err)
        }
        else {
            
            var date_lst = results.map(
                x => {
                    return x.date_
                }
            )
            var n_lst = results.map(
                x => {
                    return x.N
                }
            )

            return res.json({
                data: [{
                    labels: date_lst,
                datasets:[ 
                  {
                    label: 'My First dataset',
                    fillColor: 'rgba(220,220,220,0.2)',
                    strokeColor: 'rgba(220,220,220,1)',
                    pointColor: 'rgba(220,220,220,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: n_lst,
                  }]}]
                
            })
        }
    })
});

app.get('/datafeature',(req,res) => {
    const {keyword} = req.query;
    const SELECT_ALL_KEYWORD_DATAFEATURE = `select * from ${keyword}_DataFeature;`

    connection.query(SELECT_ALL_KEYWORD_DATAFEATURE, (err, results) => {
        if(err){
            return res.send(err)
        }
        else {
            var mean_lst = results.map(
                x => {
                    return x.mean
                }
            )
            var rms_lst = results.map(
                x => {
                    return x.rms
                }
            )

            var max_lst = results.map(
                x => {
                    return x.max
                }
            )

            console.log(mean_func(mean_lst), mean_func(rms_lst));
            return res.json({
                data: [{
                    mean: mean_func(mean_lst),
                    rms: mean_func(rms_lst),
                    is_increasing: is_increasing_fun(max_lst)
                }]
            })
        }
    })
});

app.get('/mlacurracy',(req,res) => {
    const {keyword} = req.query;
    const SELECT_ALL_KEYWORD_MLACURRACY = `select * from ${keyword}_MLaccuracy;`

    connection.query(SELECT_ALL_KEYWORD_MLACURRACY, (err, results) => {
        if(err){
            return res.send(err)
        }
        else {
            var knn_lst = results.map(
                x => {
                    return x.KNN
                }
            )
            var svm_lst = results.map(
                x => {
                    return x.SVM
                }
            )
            return res.json({
                data: [{
                    KNN: mean_func(knn_lst),
                    SVM: mean_func(svm_lst)
                }]
            })
        }
    })
});

app.get('/mlpredict',(req,res) => {
    const {keyword} = req.query;
    const SELECT_ALL_KEYWORD_MLPREDICT = `select * from ${keyword}_MLpredict;`

    connection.query(SELECT_ALL_KEYWORD_MLPREDICT, (err, results) => {
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    })
});

app.get('/products', (req,res) => {
    connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, results) => {
        if(err){
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
    //console.log(res)
});

app.get('/products/add', (req,res) => {
    const {name, price} = req.query;
    const INSERT_PRODUCTS_QUERY = `INSERT INTO products (name, price) VALUES('${name}', '${price}');`
    
    connection.query(INSERT_PRODUCTS_QUERY, (err, results) =>{
        if(err){
            return res.send(err)
        }
        else {
            return res.send('successfully added product')
        }
    })
    
    //console.log(rank, keyword, gender,date_);
    //res.send('adding data');
});


app.listen(6001, HOST_NAME,() => {
    console.log(`Products server listening on port 6001`)
});