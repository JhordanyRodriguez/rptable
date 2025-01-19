from aiohttp import web
import aiohttp_jinja2
import jinja2


async def index(request):
    return web.FileResponse('./templates/rptable/index.html')

app =  web.Application()
aiohttp_jinja2.setup(app, loader = jinja2.FileSystemLoader('templates'))
app.router.add_static('/static/', path='./static', name='static')

app.add_routes([web.get('/', index)])

web.run_app(app, port=8000)