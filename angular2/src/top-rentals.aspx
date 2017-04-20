<%@ Page Language="C#" AutoEventWireup="true" %>

<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        var client = new System.Net.WebClient();
        client.Encoding = Encoding.UTF8;
        client.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36");
        var html = client.DownloadString("https://www.rottentomatoes.com/api/private/v2.0/browse?page=1&limit=200&type=dvd-top-rentals&sortBy=popularity");
        Response.ContentType = "application/json";
        Response.Headers.Add("Access-Control-Allow-Origin", "*");
        Response.Write(html);
    }
</script>
