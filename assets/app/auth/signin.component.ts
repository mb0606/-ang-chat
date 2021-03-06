import {Component, OnInit} from "@angular/core";
import {FormBuilder, ControlGroup, Validators, Control} from "@angular/common";
import {AuthService} from "./auth.service"
import {User} from "./user"
import {Router} from "@angular/router";

@Component({
    selector: 'my-signin',
    template:`
        <section class="col-md-8 col-md-offset-2">
            <form [ngFormModel]="myForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                    
                    <label for="email">Email</label>
                    <input [ngFormControl]="myForm.find('email')"
                    type="email" id="email"
                    class="form-control">
                    
                    <label for="password">Password</label>
                    <input [ngFormControl]="myForm.find('password')"
                    type="password" id="password"
                    class="form-control">
                </div>
                <button type="submit" 
                class="btn btn-primary"
                [disabled]="!myForm.valid"
                >Sign up</button>
            </form>
        </section>


    `
})

export class SigninComponent implements OnInit {
    myForm:ControlGroup;

    constructor(private _fb:FormBuilder, private _authService: AuthService, private _router: Router
    ) {}

    onSubmit() {
        console.log(this.myForm);
        console.log(this.myForm.value);
        const user = new User(this.myForm.value.email, this.myForm.value.password);
        this._authService.signin(user)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    this._router.navigateByUrl('/')
                },
                error => console.error(error)
            );
    }

    ngOnInit() {
        this.myForm = this._fb.group({
            email: ['', Validators.compose([
                Validators.required,
                this.isEmail
            ])],
            password: ['', Validators.required]
        });
    }

    private isEmail(control:Control) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (control.value.match(re)) return null
        return {invalidMail: true}
    }
}