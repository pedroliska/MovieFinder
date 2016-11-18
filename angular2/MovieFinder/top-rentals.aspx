<%@ Page Language="C#" AutoEventWireup="true" %>

<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        var client = new System.Net.WebClient();
        var html = client.DownloadString("https://www.rottentomatoes.com/api/private/v2.0/browse?limit=200&type=dvd-top-rentals&sortBy=popularity");
        Response.ContentType = "application/json";
        Response.Headers.Add("Access-Control-Allow-Origin", "*");
        Response.Write(html);
    }
</script>
