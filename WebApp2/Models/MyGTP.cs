using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace WebApp2.Models
{
    public class MyGTP
    {
        [JsonProperty("ID")]
        public string Id { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("created_date")]
        public string CreatedDate { get; set; }
        [JsonProperty("last_modified_date")]
        public string LastModifiedDate { get; set; }
        [JsonProperty("version")]
        public int Version { get; set; }
        [JsonProperty("instruments_count")]
        public int InstrumentCount { get; set; }
        [JsonProperty("track_count")]
        public int TrackCount { get; set; }
        [JsonProperty("tacts")]
        public int Tacts { get; set; }
        [JsonProperty("tempo")]
        public int Tempo { get; set; }
        [JsonProperty("tonality")]
        public string Tonality { get; set; }
        [JsonProperty("signature")]
        public string Signature { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
        [JsonProperty("length")]
        public double Length { get; set; }
        [JsonProperty("finished")]
        public bool Finished { get; set; }
        [JsonProperty("lyric_finished")]
        public bool LyricFinished { get; set; }
        [JsonProperty("recorded")]
        public bool Recorded { get; set; }

        public void SetLength()
        {
            Length = Tempo == 0 ? 0 : 2 * Tacts * 120 / Tempo;
        }
    }
}
