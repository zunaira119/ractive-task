import Ractive from 'ractive';
import Router from '../utils/ractive-router'
import jsonData from '../user.json'; 
import emailData from '../emails.json';
import storage from '../utils/localstorage';

const storageName = 'userData';
const storageEmail = 'emailData';

export default Ractive.extend({
    template: `
        <div class="d-flex hvh-100 align-items-center justify-content-center">
            <div class="col-md-5">
                <form>
                    <div class="form-group">
                    <label for="input-user"><span class="text-muted ft-20">User</span></label>
                    <select value={{selectedUser}} class="form-control form-control-lg">
                    <option value="">Select a user</option>
                    {{#each userData}}
                        <option value={{id}}>{{name}}</option>
                    {{/each}}
                    </select>
                    </div>
                    <div class="d-flex justify-content-center mt-4">
                        <div class="wp-80">
                            <button on-click="onSubmit" type="button" class="btn btn-dark btn-lg btn-block rounded-pill">Login</button>
                            <!-- <a href="index.html" class="btn btn-dark btn-lg btn-block rounded-pill">Login</a> -->
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `,
    data:{
        userData: [],
        selectedUser:"",
    },
    storage: storage(storageName),
    storageEmail: storage(storageEmail),
    on: {
        onSubmit(){
            const selectedUser = this.get('selectedUser');
            const users = this.get('userData');

            console.log({ selectedUser })

            if(!selectedUser){
                alert("Please select a user");
                return;
            }

            const user = users.find((user) => user.id == selectedUser);
            if(!user){
                alert('User not found');
                return;
            }
            else if(user.status == 'active'){
                alert('User is already login');
                return;
            }

            const updatedUser = {
                ...user,
                status: 'active',
            }
            const userId = user.id;
            this.storage.update(userId, updatedUser);

            localStorage.setItem('loginUser', user.name);

            Router.go('/lead');



            // user.find((loginUser)=> { 
            //     if (user.indexOf(loginUser) == selectedUser)
            //     {
            //         if(loginUser.status == 'active'){
            //             alert('Already loggedIn!!');
            //         }
            //         loginUser.status = 'active';
            //         localStorage.setItem('loginUser',JSON.stringify(loginUser));
            //     } 
            // });
            // localStorage.setItem('userData', JSON.stringify(user));
            // console.log( user );
            // Router.go('/lead');
        },
    },
    oninit() {

        const emailLocalData = this.storageEmail.getAll();
        const userLocalData = this.storage.getAll();

        // Setting ID to email data
        let id = 0
        emailData = emailData.map((item) => {
            id += 1;
            return {
                ...item,
                id
            }
        })

        // Setting ID to users data
        id = 0;
        jsonData = jsonData.map((item) => {
            id += 1;
            return {
                ...item,
                id
            }
        })

        if(!emailLocalData) this.storageEmail.setAll(emailData);
        if(!userLocalData) this.storage.setAll(jsonData);
        
        const data = this.storage.getAll();
        this.set('userData', data);

    },
    onteardown() {
        console.log('Home teardown');
    },
    onrender(){
        // Redirect if user already login
        const loginUser = localStorage.getItem('loginUser');
        if(loginUser){
            Router.go('/lead');
        }
    }
});

