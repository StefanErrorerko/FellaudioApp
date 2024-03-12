﻿using FellaudioApp.Models.Enums;
using FellaudioApp.Models;

namespace FellaudioApp.Dto
{
    public class ContentDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ContentStatus Status { get; set; }
    }
}
