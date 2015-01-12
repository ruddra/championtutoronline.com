__author__ = 'Codengine'

from django import forms

class SignUpForm(forms.Form):
    first_name = forms.CharField(label='',max_length=30,widget=forms.TextInput(attrs={'placeholder': 'First Name'}))
    last_name = forms.CharField(label='',max_length=30,widget=forms.TextInput(attrs={'placeholder': 'Last Name'}))
    email = forms.CharField(label='',widget=forms.TextInput(attrs={'placeholder':'Enter Email Address'}))
    password = forms.CharField(widget=forms.PasswordInput())
    CHOICES=[('--','Register As A'),('student','Student'),('teacher','Teacher')]
    role = forms.ChoiceField(choices=CHOICES, widget=forms.RadioSelect())
