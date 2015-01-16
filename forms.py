__author__ = 'Codengine'

from django import forms

class LoginBase(forms.Form):
    email = forms.CharField(label='',widget=forms.TextInput(attrs={'placeholder':'Email Address','autocomplete':'off'}))
    password = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder':'Password'}))

class SignUpForm(LoginBase):
    name = forms.CharField(label='',max_length=30,widget=forms.TextInput(attrs={'placeholder': 'Full Name','autocomplete':'off'}))
    mobile = forms.CharField(label='',max_length=30,widget=forms.TextInput(attrs={'placeholder': 'Mobile Number','autocomplete':'off','data-title':''}))
    password_repeat = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder':'Repeat Password'}))
    CHOICES=[('--','Register As A'),('student','Student'),('teacher','Teacher')]
    role = forms.ChoiceField(label='',choices=CHOICES, widget=forms.Select(attrs={'title':'This field is required.'}))

class LoginForm(LoginBase):
    pass
