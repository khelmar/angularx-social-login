import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser } from '../entities/user';


declare let IN: any;

export class LinkedInLoginProvider extends BaseLoginProvider {

    public static readonly PROVIDER_ID: string = 'LINKEDIN';

    constructor(private clientId: string, private authorize?: boolean, private lang?: string) {
        super();
    }

    initialize(): Promise<SocialUser> {

        let inner_text = '';

        inner_text += 'api_key: ' + this.clientId + '\r\n';
        inner_text += 'authorize:' +  (this.authorize? 'true' : 'false') +  '\r\n';
        inner_text += 'lang: ' + (this.lang? this.lang : 'fr_FR') +  '\r\n';

        return new Promise((resolve, reject) => {
            this.loadScript(LinkedInLoginProvider.PROVIDER_ID,
                '//platform.linkedin.com/in.js',
                () => {
                    resolve();
                }, false, inner_text);
        });
    }

    signIn(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            IN.User.authorize(function(){
                IN.API.Raw('/people/~:(id,first-name,last-name,email-address,picture-url)').result(function(res: any){
                    let user: SocialUser = new SocialUser();
                    user.id = res.id;
                    user.name = res.firstName + " " + res.lastName;
                    user.email =res.emailAddress;
                    user.photoUrl = res.pictureUrl;
                    user.firstName = res.lastName;
                    user.lastName = res.lastName;
                    resolve(user);
                });
            });
        });
    }

    signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            IN.User.logout(function(){
                resolve();
            }, {});

        });
    }

}