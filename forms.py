__author__ = 'Codengine'

from django import forms

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
    pass
