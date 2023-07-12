import Ractive from 'ractive';
import Router from '../utils/ractive-router'
import storage from '../utils/localstorage';
// var user = localStorage.getItem('loginUser');
//  var data1 = JSON.parse(user);
const storageName = 'emailData';
const storageUsers = 'userData';
const userStorage = storage(storageUsers);

export default Ractive.extend({
    template: `
            <div class="row mt-5">
            <div class="col-md-12 d-flex align-items-center justify-content-between">
                <button on-click="resetApplication" class="text-uppercase btn btn-danger rounded-pill">Reset Applications</button>
                <h2 class="mb-0 text-uppercase text-muted">Overview Page</h2>
                <div>
                    <button on-click="onBack" class="text-uppercase btn btn-secondary rounded-pill">Back</button>
                    <button on-click="onLogout" class="text-uppercase btn btn-secondary rounded-pill">Logout</button>
                </div>
            </div>
        </div>

        <div class="row mt-5">
            <div class="col-md-12">
            <h4 class="text-muted">Positive replies: {{countPositiveReply}}</h4>
            <h4 class="text-muted">Neutral replies: {{countNeutralReply}}</h4>
            <h4 class="text-muted">Not a lead: {{countNotALead}}</h4>
            </div>
        </div>

        <div class="row mt-80">
       
            <div class="col-md-12">
                <h2 class="text-center text-muted">All Leads</h2>
            </div>
            
            {{#each emailData}}
            <div class="col-md-12 mb-2">
                <div class="border rounded p-3">
                    <div class="d-flex align-items-center justify-content-between">
                    <p><b>Email:</b> {{.email_lead}}</p>
                    <p><b>Processed By:</b> {{ .processed_by }}</p>
                    <div>
                        <b>Status:</b> 
                       {{#if .status == 'pending'}}<span class="badge badge-light">Pending</span>{{/if}}
                       {{#if .status == 'positive_reply'}}<span class="badge badge-success">Positive reply</span>{{/if}}
                       {{#if .status == 'neutral_reply'}}<span class="badge badge-primary">Neutral reply</span>{{/if}}
                       {{#if .status == 'not_a_lead'}}<span class="badge badge-secondary">Not a lead</span>{{/if}}
                    </div>
                    </div>
                    <div>
                    <div class="form-group">
                        <div class="form-group">
                        <input value={{.subject}} disabled type="text" class="form-control bg-grey-light" placeholder="Subject">
                        </div>
                        <div class="form-group">
                            <textarea value={{.body}} disabled class="form-control bg-grey-light" rows="4" placeholder="Body"></textarea>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            {{/each}}


        </div>
    `,
    data:{ 
        emailData: [],
        processedBy:"",
        countPositiveReply: 0,
        countNeutralReply: 0,
        countNotALead: 0,
    },
    on:{
        onBack(){
            console.log("Back");
            Router.go('/lead');
        },
        onLogout(){
            console.log("logout")
            const user = localStorage.getItem('loginUser');
            const users = userStorage.getAll();
            let findedUser = users.find(u => u.name == user);
            console.log({user, findedUser, users})
            
            if(findedUser){
                findedUser = {
                    ...findedUser,
                    status: 'inactive',
                }

                userStorage.update(findedUser.id, findedUser);
                localStorage.removeItem('loginUser');
                Router.go('/');
            }
        },
        resetApplication(){
            const currentData = this.get('emailData');
            const newData = currentData.map((item) => {
                return{
                    ...item,
                    status: 'pending',
                    processed_by: '',
                    restrict: [],
                }
            })

            this.storage.setAll(newData);
            this.set('emailData', newData)
        }
    },
    storage: storage(storageName),
    oninit() {
        console.log('Overview init');
        const data = this.storage.getAll();
        this.set('emailData', data);
        // this.set('processedBy',data1.name);
    },
    observe:{
        // Observe changes on the array
        'emailData' () {

            let status = {};
            // console.log('array observer', arguments)
            const newData = this.get('emailData');
            for(let item of newData ){
                if(status.hasOwnProperty(item.status)){
                    status[item.status] += 1;
                }
                else{
                    status[item.status] = 1;
                }
            }

            // Update variables
            this.set('countPositiveReply', status['positive_reply'] ?? 0 );
            this.set('countNeutralReply', status['neutral_reply'] ?? 0 );
            this.set('countNotALead', status['not_a_lead'] ?? 0);
        },
    },
    onteardown() {
        console.log('Overview teardown');
    },
    onrender(){
        // Redirect if user already login
        const loginUser = localStorage.getItem('loginUser');
        if(!loginUser){
            console.log("Must go to login page")
            Router.go('/');
        }
    }
});