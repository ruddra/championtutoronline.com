__author__ = 'Codengine'

from django import forms

class LoginBase(forms.Form):
    email = forms.CharField(label='',required=True,widget=forms.TextInput(attrs={'name':'email','placeholder':'Email Address','autocomplete':'off'}))
    password = forms.CharField(label='', required=True , widget=forms.PasswordInput(attrs={'name':'password','placeholder':'Password'}))

class SignUpForm(LoginBase):
    name = forms.CharField(label='', required=True ,max_length=30,widget=forms.TextInput(attrs={'name':'name','placeholder': 'Full Name','autocomplete':'off'}))
    mobile = forms.CharField(label='', required=True ,max_length=30,widget=forms.TextInput(attrs={'name':'mobile','placeholder': 'Mobile Number','autocomplete':'off','data-title':''}))
    password_repeat = forms.CharField(label='', required=True , widget=forms.PasswordInput(attrs={'name':'password_repeat','placeholder':'Repeat Password'}))
    CHOICES=[('--','Register As A'),('student','Student'),('teacher','Teacher')]
    role = forms.ChoiceField(label='', required=True,choices=CHOICES, widget=forms.Select(attrs={'name':'role','title':'This field is required.'}))

class LoginForm(LoginBase):
    pass
