__author__ = 'Codengine'

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
import hashlib
from core.models import ChampUser, ProfilePicture, Profile, Education, TopSubject
from image_cropping import ImageCropWidget
from core.tools.form import DateSelectorWidget

from django import forms

class PasswordResetRequestForm(forms.Form):
    '''
    prompts user to input either username or email address of that user and sends him a email for resetting his password.
    '''
    email_or_username = forms.CharField(label='',required=True,widget=forms.TextInput(attrs={'placeholder':'Enter Email or User Name','autocomplete':'off','class':'form-control input-lg'}))


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
            print c_user.user.username
            print data["password"]
            user = authenticate(username=c_user.user.username, password=data["password"])
            print user
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
                    #self.add_error('username', "Your account has been disabled!")
                    pass
            else:
                #self.add_error('username', "Your username and password were incorrect.")
                pass
            return False
        except Exception as e:
            print e


class ProfilePictureForm(forms.ModelForm):
        class Meta:
            model = ProfilePicture


class SubjectMajorUpdateForm(forms.Form):
    major_subjects = forms.CharField(widget=forms.TextInput)

    def save(self, request):
        profile = Profile.objects.get(user=ChampUser.objects.get(user=request.user))
        profile.major_subject = self.cleaned_data['major_subjects']
        profile.save()
        return profile.major_subject

class AboutMeUpdateForm(forms.Form):
    about_me = forms.CharField(widget=forms.Textarea())

    def save(self, request):
        profile = Profile.objects.get(user=ChampUser.objects.get(user=request.user))
        profile.description = self.cleaned_data['about_me']
        profile.save()
        return profile.description

class TeachingExpForm(forms.Form):
    data = forms.CharField(widget=forms.Textarea())

    def save(self, request):
        profile = Profile.objects.get(user=ChampUser.objects.get(user=request.user))
        profile.teaching_exp = self.cleaned_data['data']
        profile.save()
        return profile.teaching_exp


class ExtInterestForm(forms.Form):
    data = forms.CharField(widget=forms.Textarea())

    def save(self, request):
        profile = Profile.objects.get(user=ChampUser.objects.get(user=request.user))
        profile.ext_interest = self.cleaned_data['data']
        profile.save()
        return profile.ext_interest

class EducationForm(forms.ModelForm):
    class Meta:
        model = Education

class MyAccountForm(forms.Form):
    email = forms.CharField(label='',required=True,widget=forms.TextInput(attrs={'name':'email','placeholder':'Email Address','autocomplete':'off','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':'','readonly':''}))
    old_password = forms.CharField(label='', required=True , widget=forms.PasswordInput(attrs={'name':'password','placeholder':'Old Password','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    new_password = forms.CharField(label='', required=True , widget=forms.PasswordInput(attrs={'name':'password','placeholder':'New Password','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    new_password_again = forms.CharField(label='', required=True , widget=forms.PasswordInput(attrs={'name':'password','placeholder':'New Password Again','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))

class PaymentMethodForm(forms.Form):
    first_name = forms.CharField(label='',required=True,widget=forms.TextInput(attrs={'name':'first_name','placeholder':'First Name','autocomplete':'off','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    last_name = forms.CharField(label='',required=True,widget=forms.TextInput(attrs={'name':'last_name','placeholder':'Last Name','autocomplete':'off','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    card_type = forms.ChoiceField(choices=[("V","Visa"),("M","Master")],widget=forms.Select(attrs={'name':'card_type','placeholder':'Card Type','autocomplete':'off','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    card_number = forms.CharField(label='',required=True,widget=forms.TextInput(attrs={'name':'card_number','placeholder':'Card Number','autocomplete':'off','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    exp_date = forms.CharField(label='',required=True,widget=forms.TextInput(attrs={'name':'exp_date','placeholder':'Expired Date','autocomplete':'off','id':'datetimepicker','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    cvn = forms.CharField(label='',required=True,widget=forms.TextInput(attrs={'name':'cvn','placeholder':'CVN','autocomplete':'off','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    # primary = forms.ChoiceField(choices=[("primary","Primary Card"),("not_primary","Not Primary")],widget=forms.Select(attrs={'name':'card_type','placeholder':'Card Type','autocomplete':'off','class':'form-control input-lg','title':'','data-placement':'top','data-toggle':'tooltip','data-original-title':''}))
    # active = forms.BooleanField(required=False,widget=forms.CheckboxInput(attrs={'class':'checkbox' }))

class TSubjectForm(forms.ModelForm):
    class Meta:
        model = TopSubject
