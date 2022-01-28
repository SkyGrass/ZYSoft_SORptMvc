using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SORptMvc.Models.TableConf
{
    public class TableConf
    {
        public string data { get; set; }
        public string title { get; set; }
        public string width { get; set; }
        public bool readOnly { get; set; }
        public string type { get; set; }
        public string dateFormat { get; set; }
        public bool filter { get; set; }
        public bool query { get; set; }
        public numericFormat numericFormat { get; set; }
    }
    public class numericFormat
    {
        public string pattern { get; set; }
        public string culture { get; set; }
    }
}
