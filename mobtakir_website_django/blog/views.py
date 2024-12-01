from django.shortcuts import render

# Create your views here.
def post_list(request):
    return render(request, "blog/list.html")
def post_detail(request, id):
    return render(request, "blog/detail.html")