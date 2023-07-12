import Ractive from 'ractive';
import storage from '../utils/localstorage';
import Router from '../utils/ractive-router'
const storageName = 'emailData';

export default Ractive.extend({
    template: `
            <div class="row mt-5">
            <div class="col-md-12 d-flex align-items-center justify-content-between">
                <p class="mb-0 ft-20 text-uppercase text-muted">Elapsed Time</p>
                <button on-click="onExit" class="text-uppercase btn btn-secondary rounded-pill">Back</button>
            </div>
        </div>

        <div class="row mt-5 mb-5">
            <div class="col-md-12 d-flex justify-content-between">
                <button on-click="['onSubmitLead', 'positive_reply']" class="text-uppercase btn btn-dark rounded-pill px-5 py-2">Positive reply</button>
                <button on-click="['onSubmitLead', 'neutral_reply']" class="text-uppercase btn btn-dark rounded-pill px-5 py-2">Neutral reply</button>
                <button on-click="['onSubmitLead', 'not_a_lead']" class="text-uppercase btn btn-dark rounded-pill px-5 py-2">Not a lead</button>
            </div>
        </div>

        <div class="row mt-80">
            <div class="col-md-12">
                <h2 class="text-center text-muted">Email</h2>
            </div>
            <div class="col-md-12">
                <form>
                    <div class="form-group">
                    <input value={{selectedLead.subject}} type="text" class="form-control form-control-lg bg-grey-light" placeholder="Subject">
                    </div>
                    <div class="form-group">
                        <textarea value={{selectedLead.body}} class="form-control bg-grey-light" rows="10" placeholder="Body"></textarea>
                    </div>
                </form>
            </div>
        </div>
    `,
    data:{
        emailData: [],
        selectedLead: null,
        timerIntance: null,
    },
    storage: storage(storageName),
    on: {
        onExit(){
            console.log("Exit from lead");
            this.clearTimer()
            Router.go('/overview');
        },
        onSubmitLead(context, status){

            console.log(status)
            const lead = this.get('selectedLead');
            if(!lead) alert('No lead is selected at a moment');
            
            const user = localStorage.getItem('loginUser');
            const leadId = lead.id;
            lead.status = status;
            lead.processed_by = user;
            // delete lead.id;

            this.storage.update(leadId, lead);
            this.pickLead();

        }
    },
    oninit() {
        console.log('Lead init');
        const data = this.storage.getAll();
        this.set('emailData', data);
        this.pickLead();
    },
    onteardown() {
        console.log('Lead teardown');
        this.clearTimer();
    },
    pickLead(){

        const userId = 1;
        const selectedLead = this.get('selectedLead');
        const timerIntance = this.get('timerIntance');

        if(selectedLead && timerIntance){
            if(!selectedLead.hasOwnProperty('restrict')) selectedLead['restrict'] = [];
            selectedLead['restrict'].push(userId);
            const leadId = selectedLead.id;
            this.storage.update(leadId, selectedLead);
        }

        // resetting previous lead
        this.set('selectedLead', null);
        this.clearTimer()

        const allLeads = this.get('emailData');
        const lead =  allLeads.find((lead) => lead.status == 'pending' && (lead.restrict && lead.restrict.indexOf(userId) == -1) || (!lead.restrict) )
        console.log({ lead })
        // const leadIndex = allLeads.indexOf(lead);
        // lead.index = leadIndex;
        // console.log({ leadIndex, lead })

        if(!lead) alert('No lead is available at the moment');
        this.set('selectedLead', lead);
        const timeout = setTimeout(() => {
            alert("Page will be refreshed because session was expired");
            this.pickLead();
        }, 120000);
        this.set('timerIntance', timeout);

    },
    clearTimer(){
        const isTimerRunning = this.get('timerIntance');
        if(isTimerRunning) {
            clearInterval(isTimerRunning)
            console.log("Timer cleared")
        }
        this.set('timerIntance', null);
    },
    onrender(){
        // Redirect if user already login
        const loginUser = localStorage.getItem('loginUser');
        if(!loginUser){
            Router.go('/');
        }
    }
});