import Ractive from 'ractive';
import routesConfig from './routes';
import Router from './utils/ractive-router';

//Root App
new Ractive({
    el: '#root',
    data: {
        routesConfig,
        globals: {
            app: 'Demo' //Routes components can access globals data via ractive.get('parentGlobals') or {{parentGlobals}}
        }
    },
    components: {
        Router,
    },
    template: `
            <div class="container hvh-100">
                <Router routesConfig={{routesConfig}} />
            </div>
    `,
    oninit(){
        console.log('App init');
    },
    onrender(){
        console.log('App Render');
    },
    oncomplete(){
        console.log('App Complete');
    }
});