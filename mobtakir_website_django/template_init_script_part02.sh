mkdir -p templates/{registration,chatbot}
cat > templates/registration/register.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}register{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/register.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/register.js' %}" ></script>
{% endblock scripts %}

EOL
cat > templates/registration/login.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}login{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/login.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/login.js' %}" ></script>
{% endblock scripts %}

EOL


cat > templates/chatbot/chat_interface.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}chat-interface{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/chat_interface.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/chat_interface.js' %}" ></script>
{% endblock scripts %}

EOL
cat > templates/chatbot/chat_settings.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}parameters{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/chat_settings.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/chat_settings.js' %}" ></script>
{% endblock scripts %}

EOL

touch mobtakir_website_django/static/assets/css/{login,register,chat_interface,chat_settings}.css
touch mobtakir_website_django/static/assets/js/{login,register,chat_interface,chat_settings}.js