using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SORptMvc.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SORptMvc.Controllers
{
    public class BaseController : Controller
    {
        private IWebHostEnvironment _hostEnvironment;
        private ILogger<Controller> _logger;
        public AppAuthenticationSettings _appSettings;

        public BaseController(IOptions<AppAuthenticationSettings> appSettings, ILogger<Controller> logger, IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
            _logger = logger;
            _appSettings = appSettings.Value;
        }

        public IWebHostEnvironment GetWebHostEnvironment()
        {
            return this._hostEnvironment;
        }

        public AppAuthenticationSettings GetAppsettings()
        {
            return this._appSettings;
        }
    }
}
