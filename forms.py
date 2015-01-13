__author__ = 'Codengine'

from django import forms

class LoginBase(forms.Form):
    email = forms.CharField(label='',widget=forms.TextInput(attrs={'placeholder':'Enter Email Address','autocomplete':'off'}))
    password = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder':'Password'}))

class SignUpForm(LoginBase):
    name = forms.CharField(label='',max_length=30,widget=forms.TextInput(attrs={'placeholder': 'Full Name','autocomplete':'off'}))
    password_repeat = forms.CharField(label='', widget=forms.PasswordInput(attrs={'placeholder':'Repeat Password'}))
    CHOICES=[('--','Register As A'),('student','Student'),('teacher','Teacher')]
    role = forms.ChoiceField(label='',choices=CHOICES, widget=forms.Select())

class LoginForm(LoginBase):
    pass
