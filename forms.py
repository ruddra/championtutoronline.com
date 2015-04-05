from django.contrib.auth import authenticate, login
from core.models import ChampUser, ProfilePicture
from image_cropping import ImageCropWidget
__author__ = 'Codengine'

from django import forms

class PasswordResetRequestForm(forms.Form):
    '''
    prompts user to input either username or email address of that user and sends him a email for resetting his password.
    '''
    email_or_username = forms.CharField(label=("Email Or Username"), max_length=254)


class SetPasswordForm(forms.Form):
    """
    A form that lets a user change set their password without entering the old
    password
    """
    error_messages = {
        'password_mismatch': ("The two password fields didn't match."),
        }
    new_password1 = forms.CharField(label=("New password"),
                                    widget=forms.PasswordInput)
    new_password2 = forms.CharField(label=("New password confirmation"),
                                    widget=forms.PasswordInput)

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    self.error_messages['password_mismatch'],
                    code='password_mismatch',
                    )
        return password2

class LoginBase(forms.Form):
    email = forms.CharField(label='',required=True,widget=forms.TextInput(attrs={'name':'email','placeholder':'Email Address','autocomplete':'off','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    password = forms.CharField(label='', required=True , widget=forms.PasswordInput(attrs={'name':'password','placeholder':'Password','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    remember = forms.BooleanField(required=False)

class SignUpForm(LoginBase):
    name = forms.CharField(label='', required=True ,max_length=30,widget=forms.TextInput(attrs={'name':'name','placeholder': 'Full Name','autocomplete':'off','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    #mobile = forms.CharField(label='', required=True ,max_length=30,widget=forms.TextInput(attrs={'name':'mobile','placeholder': 'Mobile Number','autocomplete':'off','data-title':'','class':'form-control input-lg'}))
    password_repeat = forms.CharField(label='', required=True , widget=forms.PasswordInput(attrs={'name':'password_repeat','placeholder':'Repeat Password','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    CHOICES=[('--','Register As A'),('student','Student'),('teacher','Teacher')]
    role = forms.ChoiceField(label='', required=True,choices=CHOICES, widget=forms.Select(attrs={'name':'role','title':'This field is required.','class':'form-control signup-user-type-select input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))

class LoginForm(LoginBase):

    def authenticate(self, request):
        data = self.cleaned_data
        try:
            c_user = ChampUser.objects.filter(user__email = data['email']).first()
            user = authenticate(username=c_user.username, password=data["password"])
            if user is not None:
                if user.is_active:
                    login(request, user)
                    if not data['remember']:
                        request.session.set_expiry(0)
                    else:
                        seven_days = 24*60*60*7
                        request.session.set_expiry(seven_days)
                    return True
                else:
                    self.add_error('username', "Your account has been disabled!")
            else:
                self.add_error('username', "Your username and password were incorrect.")
            return False
        except Exception as e:
            print e


class ProfilePictureForm(forms.ModelForm):
        class Meta:
            model = ProfilePicture
