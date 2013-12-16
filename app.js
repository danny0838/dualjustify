
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    hbs = require('hbs');

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
  app.use(app.router);
});

app.get('/', function(req, res){
    console.log('index page');
    res.render('index', {
        title: "Justify test",
        content: [
            "說到大公司，常見的\"創新\"有兩種作法，一曰抄，二曰買。最近有人列出 Google 公司為人稱頌的產品，結果除了 Search 跟 Google Glass 是創辦人自己做的以外，其他成功的東西多半是買來的 (Android, Maps, Docs.. etc)，Facebook 呢，它的時間軸是跟 Twitter 學的，前一陣子推出的 Poke 與 Instagram Video 則擺明就是跟 Snapchat 和 Vine \"看齊\"。打不過，就下手買，其實是再常見不過的思維，只不過在 Snapchat 的這個例子裡，明擺著的是這兩家網路巨頭對於移動時代的戒慎恐懼。",
            "環保局公布，連益工業從民國90年以來被查獲的違規紀錄有6次，包含102年被查獲設備與許可內容不符，100年連續2次被查獲放流水不符標準，93年被查獲放流水不符標準，90年共2次分別為違反管理辦法、未申報貯留廢水的廢水處理情形。",
            "《紐約每日新聞》14日報導，伊利諾州退休農夫歐瑞斯（Johnny Orris），自11年前愛妻過世後就沒再享受過性愛。49歲孫子艾德替阿公報名今年10月參加廣播名嘴霍華史登的《讓我阿公上床去》競賽節目，獲得與內華達州知名「月光兔女郎山莊」妓院女郎進行3人性愛的大獎。",
            "山區、雪地、叢林、沙灘……背負四個包裹的行走機器人的步伐有點蹣跚，但依舊保持前行。幾次在冰面上的滑倒後也能迅速調整重心，恢復平衡。",
            "這就是來自機器人開發公司波士頓動力（Boston Dynamics）的明星產品大狗（BigDog）。大狗最早創建於 2005 年，現在它和獵豹（Cheetah）、野貓（WildCat）、沙蚤（Sand Flea）以及阿特拉斯（Atlas）一起成為 Google 的產品——搜索引擎巨頭在日前收購了波士頓動力。",

            "這是 Google 在過去半年內收購的第 8 家機器人製造公司。《紐約時報》在一週前公開了 Google 的機器人項目，由前 Android 部門主管安迪·魯賓（Andy Rubin）領導。擅長製造行走機器人的波士頓動力將為 Google 機器人項目注入新的血液。",

            "波士頓動力是前 MIT 教授馬克·雷波特（Marc Raibert）在 1992 年創建的公司。雷波特被譽為「美國的行走機器人之父」，他對行走機器人的研究最早是從一個名為 「The Hopper」 的小項目開始，通過這個項目測試了一些早期的概念產品。",

            "更早的時候，雷波特曾在卡耐基梅隆大學創建了一個名為 Leg Lab 的實驗室，用於研究行走機器人。隨後，雷波特又轉戰 MIT，為政府部門建設工程系統。再後來，雷波特創建波士頓動力公司，集中研發行走機器人。",

            "波士頓動力並不銷售商用機器人，他們主要為位於五角大樓的國防高級研究計劃局研發產品。此外，他們還曾為索尼的商用機器狗 Aibo 提供過諮詢服務。",

            "在波士頓動力之前，被 Google 連續收購的機器人項目分別來自美國和日本，內容從機器人軟件到更為前沿的機械臂。魯賓還表示過對機器人傳感器的興趣，不知道接下來是否會收購相關公司進行補充。",

            "魯賓把他的機器人項目稱為「月球探測器」，眼下他還不願透露項目下的具體產品。不過魯賓補充道，初代產品不會讓人們久等。預計接下來的幾年裡，人們應該可以看到成熟的 Google 商用機器人。",

            "互聯網巨頭對傳統硬件製造商的收購總是讓人聯想很多。雷波特也承認，魯賓和 Google 的能力讓他開始暢想更多可能性。現在，他們有能力把這些想法變為現實。",

            "這也激起了人們對 Google 機器人項目的追問。Google 到底在想什麼？看起來，它有點不誤正業——機器人項目與它最擅長的搜索似乎沒什麼關係。除此之外，它還嘗試了無人駕駛汽車、家庭包裹配送、可穿戴設備以及抗衰老技術。",

            "但對 Google 而言，他們的願景顯然不希望只侷限於當下，從拉里·佩奇（Larry Page）之前的描述就能看出：佩奇希望 Google 能改善人們的生活——一個更為宏大和抽象的目標。",

            "而就機器人項目而言，它對 Google 的價值如《紐約時報》所說，將協助 Google 在製造業上有所建設。另外據知情人透露，Google 還希望能通過機器人與亞馬遜在零售業上展開競爭，將產品供應鏈不斷延伸，實現從工廠將產品直接配送到用戶家門口。",

            "聽起來不錯。波士頓動力的網站還顯示，他們正在嘗試「人體模擬」項目，用於基於模擬人類行為的訓練。他們描述了一個圍繞人類展開的應用場景，表示將提高人類與電腦和可穿戴設備的交流。這與 Google 的目標不謀而合。從已經推出的幾款產品來看，他們做得還不錯。"
        ]
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

