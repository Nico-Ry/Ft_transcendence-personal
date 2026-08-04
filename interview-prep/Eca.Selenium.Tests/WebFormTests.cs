using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace Eca.Selenium.Tests;

public sealed class WebFormTests : IDisposable
{
	private readonly IWebDriver _driver;

	public WebFormTests()
	{
		ChromeOptions options = new();

		options.AddArgument("--headless=new");
		options.AddArgument("--window-size=1280,800");

		_driver = new ChromeDriver(options);
	}

	[Fact]
	public void SubmitForm_DisplaysConfirmationMessage()
	{
		// Arrange
		_driver.Navigate().GoToUrl(
			"https://www.selenium.dev/selenium/web/web-form.html"
		);

		Assert.Equal("Web form", _driver.Title);

		// Act
		IWebElement textInput =
			_driver.FindElement(By.Name("my-text"));

		textInput.SendKeys("Nicolas");

		IWebElement submitButton =
			_driver.FindElement(By.CssSelector("button"));

		submitButton.Click();

		// Assert
		WebDriverWait wait = new(
			_driver,
			TimeSpan.FromSeconds(5)
		);

		IWebElement message = wait.Until(
			driver => driver.FindElement(By.Id("message"))
		);

		Assert.Equal("Received!", message.Text);
	}

	public void Dispose()
	{
		_driver.Quit();
		_driver.Dispose();
	}
}
