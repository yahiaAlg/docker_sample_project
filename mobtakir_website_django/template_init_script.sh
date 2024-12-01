cat > templates/pages/index.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/.js' %}" ></script>
{% endblock scripts %}

EOL
cat > templates/pages/about.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/.js' %}" ></script>
{% endblock scripts %}

EOL
cat > templates/pages/contact.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/.js' %}" ></script>
{% endblock scripts %}

EOL
cat > templates/blog/list.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/.js' %}" ></script>
{% endblock scripts %}

EOL
cat > templates/blog/details.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/.js' %}" ></script>
{% endblock scripts %}

EOL
cat > templates/pages/support.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/.js' %}" ></script>
{% endblock scripts %}

EOL
cat > templates/pages/api_documentation.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/.js' %}" ></script>
{% endblock scripts %}

EOL
cat > templates/pages/pricings.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}{% endblock title %}
{% block styles %}
        <link rel="stylesheet" type="text/css" href="{% static 'assets/css/.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/.js' %}" ></script>
{% endblock scripts %}

EOL
cat > templates/pages/payment.html <<EOL
{% extends "base.html" %}
{% load static %}
{% block title %}{% endblock title %}
{% block styles %}

    <link rel="stylesheet" type="text/css" href="{% static 'assets/css/.css' %}" />
{% endblock styles %}
{% block content %}

{% endblock content %}
{% block scripts %}
    <script  type="text/javascript" src="{% static 'assets/js/.js' %}" ></script>  
{% endblock scripts %}

EOL


touch mobtakir_website_django/static/assets/css/{index,about,contact,list,details,support,api_documentation,pricings,payment}.css
touch mobtakir_website_django/static/assets/js/{index,about,contact,list,details,support,api_documentation,pricings,payment}.js