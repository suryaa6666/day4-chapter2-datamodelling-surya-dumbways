const express = require('express');
const fs = require('fs');
const multipart = require('connect-multiparty');
let multipartMiddleware = multipart({ uploadDir: './assets/imageupload' });
const db = require('./connection/db');

const app = express();
const port = 8000;

app.set('view engine', 'hbs'); // view engine is set to handlebars

app.use('/assets', express.static(__dirname + '/assets')); // static files are served from the assets folder
app.use(express.urlencoded({ extended: false }));

let isLogin = true;

function dhm(t) {
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor((t - d * cd) / ch),
        m = Math.round((t - d * cd - h * ch) / 60000);
    if (m === 60) {
        h++;
        m = 0;
    }
    if (h === 24) {
        d++;
        h = 0;
    }

    return d;
}


const convertyyyymmdd = (date) => {
    let yyyy = new Date(date).getFullYear();
    let mm = new Date(date).getMonth() + 1;
    mm = mm < 10 ? "0" + mm : mm;
    let dd = new Date(date).getDate();

    return `${yyyy}-${mm}-${dd}`;
}

const convertddmmyyyy = (date) => {
    let yyyy = new Date(date).getFullYear();
    let mm = new Date(date).getMonth() + 1;
    mm = mm < 10 ? "0" + mm : mm;
    let dd = new Date(date).getDate();

    return `${dd}-${mm}-${yyyy}`;
}

db.connect((err, client, done) => {

    if (err) throw err;

    app.get('/', (req, res) => {

        client.query(`SELECT * FROM public.tb_project`, (err, result) => {
            if (err) throw err;

            let data = result.rows.map((item) => {
                let duration = dhm(new Date(item.end_date) - new Date(item.start_date));
                duration = Math.floor(duration / 30) <= 0 ? duration + ' hari' : duration % 30 == 0 ? Math.floor(duration / 30) + ' bulan ' : Math.floor(duration / 30) + ' bulan ' + duration % 30 + ' hari';
                return {
                    ...item,
                    duration,
                    isLogin
                }
            });

            data.forEach((item) => {

                if (typeof (item.technologies) == 'string') {
                    item.technologies = [item.technologies];
                }
            });

            console.log(data)

            res.render('index', { isLogin, data });
        });

    });

    app.get('/project-detail/:id', (req, res) => {
        let id = req.params.id;

        client.query(`SELECT * FROM public.tb_project WHERE id=${id}`, (err, result) => {
            if (err) throw err;

            let projectDetail = result.rows[0];

            let duration = dhm(new Date(projectDetail.end_date) - new Date(projectDetail.start_date));
            duration = Math.floor(duration / 30) <= 0 ? duration + ' hari' : duration % 30 == 0 ? Math.floor(duration / 30) + ' bulan ' : Math.floor(duration / 30) + ' bulan ' + duration % 30 + ' hari';

            projectDetail.duration = duration;
            projectDetail.start_date = convertddmmyyyy(projectDetail.start_date);
            projectDetail.end_date = convertddmmyyyy(projectDetail.end_date);

            res.render('project-detail', { projectDetail });
        });
    });

    app.get('/contact', (req, res) => {
        res.render('contact', { isLogin });
    });

    app.get('/add-project', (req, res) => {
        res.render('add-project');
    });

    app.get('/edit-project/:id', (req, res) => {
        let id = req.params.id;
        client.query(`SELECT * FROM public.tb_project WHERE id=${id}`, (err, result) => {
            if (err) throw err;

            let project = result.rows[0];

            project.start_date = convertyyyymmdd(project.start_date)
            project.end_date = convertyyyymmdd(project.end_date)

            console.log(project);
            let tech = project.technologies.toString();
            res.render('edit-project', { project, tech });
        });
    });

    // app.post('/edit-project/:id', multipartMiddleware, (req, res) => {
    //     let id = req.params.id;
    //     let name = req.body.name;
    //     let startdate = req.body.startdate;
    //     let enddate = req.body.enddate;
    //     let description = req.body.description;
    //     let duration = dhm(new Date(enddate) - new Date(startdate));
    //     duration = Math.floor(duration / 30) <= 0 ? duration + ' hari' : duration % 30 == 0 ? Math.floor(duration / 30) + ' bulan ' : Math.floor(duration / 30) + ' bulan ' + duration % 30 + ' hari';
    //     let technologies = req.body.technologies;
    //     let imagepath = req.files.imageupload.path;
    //     let imageupload = imagepath.split('\\');
    //     imageupload = imageupload[imageupload.length - 1];
    //     // console.log(imageupload);
    //     // console.log(tech);

    //     let query = `SELECT * FROM public.tb_project SET name=${name}, start_date=${startdate}, end_date=${enddate}, description=${description}, technologies=${technologies}, image=${imageupload} WHERE id=${id}`;

    //     client.query(query, (err, result) => {

    //         if (err) throw err;

    //         console.log(result);
    //         return;
    //         res.redirect('/');
    //     });

    // });

    // app.post('/add-project', multipartMiddleware, (req, res) => {
    //     let startdate = req.body.startdate;
    //     let enddate = req.body.enddate;
    //     let duration = dhm(new Date(enddate) - new Date(startdate));
    //     duration = Math.floor(duration / 30) <= 0 ? duration + ' hari' : duration % 30 == 0 ? Math.floor(duration / 30) + ' bulan ' : Math.floor(duration / 30) + ' bulan ' + duration % 30 + ' hari';
    //     let imagepath = req.files.imageupload.path;
    //     let imageupload = imagepath.split('\\');
    //     imageupload = imageupload[imageupload.length - 1];
    //     // console.log(imageupload[imageupload.length - 1]);

    //     client.query(`INSERT INTO public.tb_project(name, start_date, end_date, description, technologies, image) VALUES(${name},${startdate},${enddate},${description},${technologies},${image})`, (err, result) => {

    //         if (err) throw err;

    //         res.redirect('/');
    //     });

    // });

    // app.get('/delete-project/:id', (req, res) => {
    //     let id = req.params.id;

    //     client.query(`DELETE FROM public.tb_project WHERE id=${id}`, (err, result) => {
    //         if (err) throw err;
    //     });

    //     client.query(`SELECT * FROM public.tb_project WHERE id=${id}`, (err, result) => {
    //         if (err) throw err;

    //         let dataSelected = result.rows[0];

    //         fs.unlinkSync(`assets/imageupload/${dataSelected.imageupload}`);
    //     });

    //     res.redirect('/');
    // });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

