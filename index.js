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

// let dataProject = [
//     {
//         id: 1,
//         name: 'Aplikasi Rental PS',
//         startdate: '2022-06-01',
//         enddate: '2022-06-30',
//         duration: '1 bulan',
//         description: 'Aplikasi ini menggunakan React Native dan MySQL untuk mengelola data rental PS',
//         technologies: ['react', 'android'],
//         imageupload: 'projek1.jpg'
//     }
// ];

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

db.connect((err, client, done) => {

    if (err) throw err;

    app.get('/', (req, res) => {

        client.query(`SELECT * FROM public.tb_project`, (err, result) => {
            if (err) throw err;

            let data = result.rows.map((item) => {
                return {
                    ...item,
                    isLogin
                }
            });

            data.forEach((item) => {
                if (typeof (item.technologies) == 'string') {
                    item.technologies = [item.technologies];
                }
            });

            // console.log(data)

            res.render('index', { isLogin, data });

        });

    });

    app.get('/project-detail/:id', (req, res) => {
        let id = req.params.id;

        let projectDetail = dataProject.find((item) => {
            return item.id == id;
        })

        res.render('project-detail', { projectDetail });
    });

    app.get('/contact', (req, res) => {
        res.render('contact', { isLogin });
    });

    app.get('/project-detail/:id', (req, res) => {
        let id = req.params.id;

        res.render('project-detail', {
            projectDetail: {
                id,
                name: 'Project membuat aplikasi rental PS',
                description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
            molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
            numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
            optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
            obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
            nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
            tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
            quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos 
            sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam
            recusandae alias error harum maxime adipisci amet laborum. Perspiciatis 
            minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit 
            quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur 
            fugiat, temporibus enim commodi iusto libero magni deleniti quod quam 
            consequuntur! Commodi minima excepturi repudiandae velit hic maxime
            doloremque. Quaerat provident commodi consectetur veniam similique ad 
            earum omnis ipsum saepe, voluptas, hic voluptates pariatur est explicabo 
            fugiat, dolorum eligendi quam cupiditate excepturi mollitia maiores labore 
            suscipit quas? Nulla, placeat. Voluptatem quaerat non architecto ab laudantium
            modi minima sunt esse temporibus sint culpa, recusandae aliquam numquam 
            totam ratione voluptas quod exercitationem fuga. Possimus quis earum veniam 
            quasi aliquam eligendi, placeat qui corporis!`,
                image: '../assets/img/projek1.jpeg',
                duration: '1 month',
            }
        });
    });

    app.get('/add-project', (req, res) => {
        res.render('add-project');
    });

    app.get('/edit-project/:id', (req, res) => {
        let id = req.params.id;
        let project = dataProject.find((item) => {
            return item.id == id;
        });

        console.log(project);
        let tech = project.technologies.toString();
        res.render('edit-project', { project, tech });
    });

    app.post('/edit-project/:id', multipartMiddleware, (req, res) => {
        let id = req.params.id;
        let name = req.body.name;
        let startdate = req.body.startdate;
        let enddate = req.body.enddate;
        let description = req.body.description;
        let duration = dhm(new Date(enddate) - new Date(startdate));
        duration = Math.floor(duration / 30) <= 0 ? duration + ' hari' : duration % 30 == 0 ? Math.floor(duration / 30) + ' bulan ' : Math.floor(duration / 30) + ' bulan ' + duration % 30 + ' hari';
        let technologies = req.body.technologies;
        let imagepath = req.files.imageupload.path;
        let imageupload = imagepath.split('\\');
        imageupload = imageupload[imageupload.length - 1];
        // console.log(imageupload);
        // console.log(tech);

        dataProject.forEach((item) => {
            if (item.id == id) {
                item.name = name;
                item.startdate = startdate;
                item.enddate = enddate;
                item.description = description;
                item.duration = duration;
                item.technologies = technologies;
                item.imageupload = imageupload;
            }
        });

        res.redirect('/');
    });

    app.post('/add-project', multipartMiddleware, (req, res) => {
        let startdate = req.body.startdate;
        let enddate = req.body.enddate;
        let duration = dhm(new Date(enddate) - new Date(startdate));
        duration = Math.floor(duration / 30) <= 0 ? duration + ' hari' : duration % 30 == 0 ? Math.floor(duration / 30) + ' bulan ' : Math.floor(duration / 30) + ' bulan ' + duration % 30 + ' hari';
        let imagepath = req.files.imageupload.path;
        let imageupload = imagepath.split('\\');
        imageupload = imageupload[imageupload.length - 1];
        // console.log(imageupload[imageupload.length - 1]);

        let project = {
            id: dataProject.length + 1,
            name: req.body.name,
            startdate,
            enddate,
            duration,
            description: req.body.description,
            technologies: req.body.technologies,
            imageupload,
        };

        // console.log(req.files);
        dataProject.push(project);
        res.redirect('/');
    });

    app.get('/delete-project/:id', (req, res) => {
        let id = req.params.id;

        let dataSelected = dataProject.find((item) => {
            return item.id == id;
        });

        fs.unlinkSync(`assets/imageupload/${dataSelected.imageupload}`);

        dataProject = dataProject.filter((item) => {
            return item.id != id;
        });

        res.redirect('/');
    });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

