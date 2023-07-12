import lead from './components/lead';
import Login from './components/login';
import overview from './components/overview';

export default {
    /* Home route designed by the index: true attribute */
    '': {
        component: Login,
        index: true
    },
    'overview': {
        component: overview,
    },
    'lead': {
        component: lead,
    },
};